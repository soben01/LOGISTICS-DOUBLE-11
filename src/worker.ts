export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[]; success: boolean }>;
  run(): Promise<{ success: boolean }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface Fetcher {
  fetch(request: Request | string, init?: RequestInit): Promise<Response>;
}

export interface KVNamespace {
  get(key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number; expiration?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface WorkersAI {
  run(model: string, inputs: Record<string, unknown>): Promise<any>;
}

export interface AnalyticsEngineDataset {
  writeDataPoint(event: { blobs?: string[]; doubles?: number[]; indexes?: string[] }): void;
}

export interface Env {
  DB: D1Database;
  USERS_DB: D1Database;
  ASSETS: Fetcher;
  LOGISTICS_CACHE?: KVNamespace;
  AI?: WorkersAI;
  LOGISTICS_ANALYTICS?: AnalyticsEngineDataset;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // API: Cloudflare Infrastructure Healthcheck & Multi-Binding Status
    if (url.pathname === '/api/db-status') {
      try {
        const shipmentsCount = await env.DB.prepare('SELECT count(*) as count FROM shipments').first<{ count: number }>();
        const usersCount = await env.USERS_DB.prepare('SELECT count(*) as count FROM users').first<{ count: number }>();

        return new Response(
          JSON.stringify({
            status: 'operational',
            tier: 'enterprise_edge',
            bindings: {
              d1_tracking_db: {
                status: 'connected',
                name: 'tracking_db',
                id: '165e3eb4-9323-413f-be55-cc7846857cd3',
                total_shipments: shipmentsCount?.count || 0,
              },
              d1_users_db: {
                status: 'connected',
                name: 'users',
                id: '6adbc3b5-ed24-48cc-8be2-8244363b650d',
                total_users: usersCount?.count || 0,
              },
              kv_edge_cache: {
                status: env.LOGISTICS_CACHE ? 'active' : 'unbound',
                binding: 'LOGISTICS_CACHE',
                id: 'fbe236634e3b4516a768338e81028b55',
                purpose: 'Sub-10ms edge caching for tracking manifests & rate tariffs',
              },
              workers_ai: {
                status: env.AI ? 'active' : 'unbound',
                binding: 'AI',
                models: ['@cf/meta/llama-3.1-8b-instruct'],
                purpose: 'Supply chain route optimization, delay risk scoring & customs assistant',
              },
              analytics_engine: {
                status: env.LOGISTICS_ANALYTICS ? 'active' : 'unbound',
                binding: 'LOGISTICS_ANALYTICS',
                dataset: 'logistics_telemetry',
                purpose: 'Real-time time-series telemetry for consignment scans & checkpoint events',
              },
            },
            timestamp: new Date().toISOString(),
          }),
          { headers: CORS_HEADERS }
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return new Response(JSON.stringify({ status: 'error', error: message }), {
          status: 500,
          headers: CORS_HEADERS,
        });
      }
    }

    // API: Real-time Tracking lookup with Cloudflare Edge KV Caching & Analytics
    if (url.pathname === '/api/track') {
      const trackingNumber = url.searchParams.get('id') || url.searchParams.get('number');
      if (!trackingNumber) {
        return new Response(JSON.stringify({ error: 'Tracking number required' }), {
          status: 400,
          headers: CORS_HEADERS,
        });
      }
      try {
        const clean = trackingNumber.trim();

        // 1. Check Cloudflare KV Edge Cache first
        if (env.LOGISTICS_CACHE) {
          try {
            const cached = await env.LOGISTICS_CACHE.get(`track:${clean}`);
            if (cached) {
              const parsed = JSON.parse(cached);
              // Log cache hit telemetry
              env.LOGISTICS_ANALYTICS?.writeDataPoint({
                blobs: [clean, 'cache_hit', parsed.status || 'unknown'],
                doubles: [Date.now(), 1],
              });
              return new Response(JSON.stringify({ found: true, consignment: parsed, source: 'cloudflare_kv_cache' }), {
                headers: CORS_HEADERS,
              });
            }
          } catch {
            // Non-blocking KV fallback to D1
          }
        }

        // 2. Query Cloudflare D1 Database
        const result = await env.DB.prepare(
          'SELECT * FROM shipments WHERE tracking_number = ? OR reference_number = ? OR reference_no = ? LIMIT 1'
        )
          .bind(clean, clean, clean)
          .first();

        if (!result) {
          env.LOGISTICS_ANALYTICS?.writeDataPoint({
            blobs: [clean, 'not_found'],
            doubles: [Date.now(), 0],
          });
          return new Response(JSON.stringify({ found: false, error: 'Consignment not found in Cloudflare D1', trackingNumber: clean }), {
            status: 404,
            headers: CORS_HEADERS,
          });
        }

        // 3. Populate Cloudflare KV Edge Cache with 60s TTL
        if (env.LOGISTICS_CACHE) {
          try {
            await env.LOGISTICS_CACHE.put(`track:${clean}`, JSON.stringify(result), { expirationTtl: 60 });
          } catch {
            // Non-blocking
          }
        }

        // 4. Record Analytics Engine telemetry
        env.LOGISTICS_ANALYTICS?.writeDataPoint({
          blobs: [clean, 'd1_query', String((result as any).status || 'active')],
          doubles: [Date.now(), 1],
        });

        return new Response(JSON.stringify({ found: true, consignment: result, source: 'cloudflare_d1_database' }), {
          headers: CORS_HEADERS,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: CORS_HEADERS,
        });
      }
    }

    // API: Enterprise Workers AI Route Optimizer & Transit Advisor
    if (url.pathname === '/api/ai-advisor') {
      try {
        let prompt = '';
        if (request.method === 'POST') {
          const body = await request.json() as any;
          prompt = body.prompt || `Advise on shipping route from ${body.origin || 'Kathmandu'} to ${body.destination || 'Pokhara'} for ${body.weight || 5}kg of ${body.cargo || 'General Goods'}.`;
        } else {
          const origin = url.searchParams.get('origin') || 'Kathmandu Mega-Hub';
          const destination = url.searchParams.get('destination') || 'Pokhara Regional Hub';
          const cargo = url.searchParams.get('cargo') || 'Standard Express Parcel';
          prompt = `Provide a concise, professional supply chain logistics transit assessment for moving ${cargo} from ${origin} to ${destination} across Nepal highways (mentioning corridor status e.g. Prithvi or BP Highway, estimated transit time, weather/landslide risk score 1-10, and handling tips).`;
        }

        if (env.AI) {
          let aiResponse: any = null;
          const candidateModels = [
            '@cf/meta/llama-3.2-3b-instruct',
            '@cf/meta/llama-3.2-1b-instruct',
            '@cf/mistral/mistral-7b-instruct-v0.1',
            '@cf/qwen/qwen1.5-7b-chat-awq'
          ];
          let usedModel = candidateModels[0];

          for (const m of candidateModels) {
            try {
              aiResponse = await env.AI.run(m, {
                messages: [
                  {
                    role: 'system',
                    content: 'You are Double 11 Logistics Command AI, an enterprise freight routing and supply chain optimization assistant for Nepal and cross-border trade. Respond concisely with realistic logistics guidance.'
                  },
                  { role: 'user', content: prompt }
                ],
                max_tokens: 350
              });
              usedModel = m;
              if (aiResponse) break;
            } catch {
              // Try next candidate model
            }
          }

          return new Response(JSON.stringify({
            success: true,
            provider: 'Cloudflare Workers AI',
            model: usedModel,
            advisor: aiResponse?.response || aiResponse
          }), {
            headers: CORS_HEADERS
          });
        }

        return new Response(JSON.stringify({
          success: false,
          error: 'Workers AI binding currently inactive'
        }), {
          status: 503,
          headers: CORS_HEADERS
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: CORS_HEADERS
        });
      }
    }

    // API: Live Consignments from Cloudflare D1
    if (url.pathname === '/api/shipments') {
      try {
        const { results } = await env.DB.prepare('SELECT * FROM shipments ORDER BY id DESC LIMIT 100').all();
        return new Response(JSON.stringify({ success: true, count: results.length, shipments: results }), {
          headers: CORS_HEADERS,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: CORS_HEADERS,
        });
      }
    }

    // API: Users list from Cloudflare D1 users database
    if (url.pathname === '/api/users') {
      try {
        const { results } = await env.USERS_DB.prepare('SELECT id, name, email, role, sub_role, company, phone, created_at FROM users ORDER BY id ASC').all();
        return new Response(JSON.stringify({ success: true, count: results.length, users: results }), {
          headers: CORS_HEADERS,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: CORS_HEADERS,
        });
      }
    }

    // Static Assets Fallback: Serves Next.js SSG output
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404) {
        return env.ASSETS.fetch(new Request(new URL('/404.html', request.url), request));
      }
      return response;
    } catch {
      return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
    }
  },
};
