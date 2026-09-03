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

export interface Env {
  DB: D1Database;
  USERS_DB: D1Database;
  ASSETS: Fetcher;
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

    // API: Cloudflare D1 Database status & healthcheck
    if (url.pathname === '/api/db-status') {
      try {
        const shipmentsCount = await env.DB.prepare('SELECT count(*) as count FROM shipments').first<{ count: number }>();
        const usersCount = await env.USERS_DB.prepare('SELECT count(*) as count FROM users').first<{ count: number }>();

        return new Response(
          JSON.stringify({
            status: 'connected',
            tracking_database: {
              name: 'tracking_db',
              id: '165e3eb4-9323-413f-be55-cc7846857cd3',
              total_shipments: shipmentsCount?.count || 0,
            },
            users_database: {
              name: 'users',
              id: '6adbc3b5-ed24-48cc-8be2-8244363b650d',
              total_users: usersCount?.count || 0,
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

    // API: Real-time Tracking lookup from Cloudflare D1 tracking_db
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
        const result = await env.DB.prepare(
          'SELECT * FROM shipments WHERE tracking_number = ? OR reference_number = ? OR reference_no = ? LIMIT 1'
        )
          .bind(clean, clean, clean)
          .first();

        if (!result) {
          return new Response(JSON.stringify({ found: false, error: 'Consignment not found in Cloudflare D1', trackingNumber: clean }), {
            status: 404,
            headers: CORS_HEADERS,
          });
        }
        return new Response(JSON.stringify({ found: true, consignment: result }), {
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
        const { results } = await env.USERS_DB.prepare('SELECT id, name, email, company, phone, role, status, cod_balance_npr, created_at FROM users').all();
        return new Response(JSON.stringify({ success: true, users: results }), {
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

    // Pass-through to static Next.js assets
    return env.ASSETS.fetch(request);
  },
};
