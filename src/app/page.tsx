'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plane,
  Ship,
  Truck,
  Boxes,
  ShieldCheck,
  Zap,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  TrendingUp,
  Globe,
  Sliders,
  Cpu,
  ChevronRight,
  Sparkles,
  Layers,
  BarChart3
} from 'lucide-react';
import { calculateFreightRate, RateOption } from '../lib/store';

export default function HomePage() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState('');

  // Quick Rate Calculator state
  const [originCountry, setOriginCountry] = useState('HKG');
  const [destCountry, setDestCountry] = useState('USA');
  const [weightKg, setWeightKg] = useState<number>(5.5);
  const [lengthCm, setLengthCm] = useState<number>(35);
  const [widthCm, setWidthCm] = useState<number>(25);
  const [heightCm, setHeightCm] = useState<number>(20);
  const [calculatedRates, setCalculatedRates] = useState<RateOption[] | null>(null);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    router.push(`/track?id=${encodeURIComponent(trackingId.trim())}`);
  };

  const handleSampleClick = (id: string) => {
    router.push(`/track?id=${id}`);
  };

  const handleCalculateRate = (e: React.FormEvent) => {
    e.preventDefault();
    const rates = calculateFreightRate({
      originCountry,
      destCountry,
      weightKg: Number(weightKg),
      lengthCm: Number(lengthCm),
      widthCm: Number(widthCm),
      heightCm: Number(heightCm),
      goodsType: 'General Cargo',
    });
    setCalculatedRates(rates);
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Ambient Glows */}
      <div className="hero-ambient-glow" />

      {/* ================= HERO SECTION ================= */}
      <section style={{
        position: 'relative',
        padding: '4rem 0 5rem 0',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '3.5rem', alignItems: 'center' }} className="hero-grid">
            {/* Left Col: Headings & Quick Search */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }} className="badge badge-orange">
                <Zap size={13} />
                <span>Double 11 High-Velocity Global Logistics</span>
              </div>

              <h1 style={{ marginBottom: '1.25rem' }}>
                Unstoppable Cargo Speed for the <span style={{
                  background: 'linear-gradient(135deg, #ff6600 0%, #ff944d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Global E-Commerce</span> Era.
              </h1>

              <p style={{ fontSize: '1.12rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '560px' }}>
                Built for peak-surge volumes, international air express, and precision cross-border supply chains. Experience sub-second telemetry, automated customs clearance, and dedicated freight charters.
              </p>

              {/* Instant Tracking Box */}
              <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', maxWidth: '580px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Search size={15} color="var(--brand-orange)" />
                  <span>TRACK CONSIGNMENT OR AIRWAY BILL (AWB)</span>
                </div>

                <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter Tracking # (e.g. D11-8892-EXP)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    style={{ flex: 1, minWidth: '220px', fontFamily: 'var(--font-mono)', fontSize: '1rem', padding: '0.85rem 1.1rem' }}
                  />
                  <button type="submit" className="btn btn-primary btn-lg" style={{ padding: '0.85rem 1.5rem' }}>
                    <span>Track Now</span>
                    <ArrowRight size={16} />
                  </button>
                </form>

                {/* 1-Click Demo Samples */}
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Try Live Samples:</span>
                  <button
                    type="button"
                    onClick={() => handleSampleClick('D11-8892-EXP')}
                    className="badge badge-subtle"
                    style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                  >
                    D11-8892-EXP (Air Express)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleClick('D11-4410-SEA')}
                    className="badge badge-subtle"
                    style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                  >
                    D11-4410-SEA (Ocean FCL)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleClick('D11-9921-AIR')}
                    className="badge badge-subtle"
                    style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                  >
                    D11-9921-AIR (Out for Delivery)
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="var(--brand-emerald)" /> IATA Certified Charters
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="var(--brand-emerald)" /> 100% Carbon Neutral Option
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="var(--brand-emerald)" /> 99.8% On-Time SLA
                </span>
              </div>
            </div>

            {/* Right Col: Hero Graphic Card with Live Telemetry Overlay */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
                position: 'relative'
              }}>
                <img
                  src="/images/hero.jpg"
                  alt="Double 11 Air Cargo Apron and Hub Terminal"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />

                {/* Glassmorphic Live Telemetry Overlay Card */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  background: 'rgba(9, 13, 22, 0.88)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ACTIVE CHARTER</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>D11-CX884</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--brand-cyan)' }}>B777-Freighter</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ROUTE TRANSIT</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>HKG &rarr; LAX</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--brand-emerald)' }}>Alt: FL340 (On Time)</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PAYLOAD</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>104,200 KG</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--brand-orange)' }}>Full Capacity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LIVE METRICS STRIP ================= */}
      <section style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '2.5rem 0'
      }}>
        <div className="container">
          <div className="grid grid-cols-4 gap-6">
            <div className="metric-pill">
              <div className="metric-number" style={{ color: 'var(--brand-orange)' }}>99.8%</div>
              <div className="metric-label">On-Time Delivery SLA</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Strict fulfillment guarantee</div>
            </div>

            <div className="metric-pill">
              <div className="metric-number" style={{ color: 'var(--brand-cyan)' }}>4.2M+</div>
              <div className="metric-label">Parcels Handled Weekly</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Scales effortlessly during Double 11</div>
            </div>

            <div className="metric-pill">
              <div className="metric-number" style={{ color: 'var(--brand-emerald)' }}>18 MIN</div>
              <div className="metric-label">Avg Hub In-to-Out Sorting</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Automated AGV robotics</div>
            </div>

            <div className="metric-pill">
              <div className="metric-number" style={{ color: '#ffffff' }}>120+</div>
              <div className="metric-label">Countries Directly Connected</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Air, maritime & ground lanes</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE INSTANT RATE ESTIMATOR ================= */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--border-subtle)' }} id="calculator">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>
              <Sliders size={13} /> Transparent Pricing
            </div>
            <h2>Instant Freight Rate Estimator</h2>
            <p style={{ maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
              Calculate exact shipping rates, dimensional weight, and estimated transit times across our dedicated logistics network.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem 2.5rem', maxWidth: '1080px', margin: '0 auto' }}>
            <form onSubmit={handleCalculateRate} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', alignItems: 'flex-end' }} className="calc-grid">
              {/* Origin */}
              <div className="input-group">
                <label className="input-label">Origin Gateway</label>
                <select
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="select-field"
                >
                  <option value="HKG">Hong Kong (HKG)</option>
                  <option value="CHN">Shenzhen / Shanghai (CHN)</option>
                  <option value="SGP">Singapore (SGP)</option>
                  <option value="JPN">Tokyo (JPN)</option>
                  <option value="DEU">Frankfurt (DEU)</option>
                </select>
              </div>

              {/* Destination */}
              <div className="input-group">
                <label className="input-label">Destination Country</label>
                <select
                  value={destCountry}
                  onChange={(e) => setDestCountry(e.target.value)}
                  className="select-field"
                >
                  <option value="USA">United States (USA)</option>
                  <option value="GBR">United Kingdom (GBR)</option>
                  <option value="DEU">Germany (DEU)</option>
                  <option value="SGP">Singapore (SGP)</option>
                  <option value="AUS">Australia (AUS)</option>
                  <option value="CAN">Canada (CAN)</option>
                </select>
              </div>

              {/* Weight */}
              <div className="input-group">
                <label className="input-label">Weight (KG)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="1000"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 1)}
                  className="input-field"
                />
              </div>

              {/* Dimensions */}
              <div className="input-group">
                <label className="input-label">Dimensions (L&times;W&times;H cm)</label>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <input
                    type="number"
                    placeholder="L"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(parseInt(e.target.value) || 1)}
                    className="input-field"
                    style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}
                  />
                  <input
                    type="number"
                    placeholder="W"
                    value={widthCm}
                    onChange={(e) => setWidthCm(parseInt(e.target.value) || 1)}
                    className="input-field"
                    style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}
                  />
                  <input
                    type="number"
                    placeholder="H"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseInt(e.target.value) || 1)}
                    className="input-field"
                    style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px' }}>
                  <span>Calculate Quotes</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>

            {/* Results Grid */}
            {calculatedRates && (
              <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>Available Service Tiers</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Chargeable Wt: <strong>{Math.max(weightKg, (lengthCm * widthCm * heightCm) / 5000).toFixed(1)} KG</strong> (Volumetric 1:5000)
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {calculatedRates.map((rate, i) => (
                    <div
                      key={i}
                      className="card"
                      style={{
                        position: 'relative',
                        border: rate.recommended ? '1px solid var(--brand-orange)' : undefined,
                        background: rate.recommended ? 'rgba(255, 102, 0, 0.04)' : undefined
                      }}
                    >
                      {rate.recommended && (
                        <div style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '15px',
                          background: 'var(--brand-orange)',
                          color: '#fff',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px'
                        }}>
                          RECOMMENDED
                        </div>
                      )}

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        {rate.serviceCode}
                      </div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{rate.serviceName}</h4>
                      
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-orange)', fontFamily: 'var(--font-mono)', margin: '0.75rem 0' }}>
                        ${rate.estimatedCostUsd} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>USD</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--brand-emerald)', marginBottom: '1rem' }}>
                        <Clock size={14} /> {rate.transitDays}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginBottom: '1.25rem' }}>
                        Carrier: <strong>{rate.carrierType}</strong>
                      </div>

                      <Link
                        href={`/book?service=${rate.serviceCode}&origin=${originCountry}&dest=${destCountry}&wt=${weightKg}`}
                        className={`btn btn-sm ${rate.recommended ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ width: '100%' }}
                      >
                        Book This Tier
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= CORE SERVICES ================= */}
      <section style={{ padding: '5.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div className="badge badge-amber" style={{ marginBottom: '0.75rem' }}>
                <Boxes size={13} /> Full-Stack Solutions
              </div>
              <h2>Engineered for High-Velocity Freight</h2>
            </div>
            <Link href="/rates" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>View All Rates & Tiers</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Service 1: Air Express */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(255, 102, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-orange)',
                marginBottom: '1.25rem'
              }}>
                <Plane size={24} />
              </div>
              <h3>Double 11 Super Express</h3>
              <p style={{ margin: '0.75rem 0 1.25rem 0', fontSize: '0.92rem' }}>
                Dedicated transpacific and Eurasian charter flights operating Boeing 777F cargo aircraft with guaranteed departure windows and sub-48-hour door-to-door transit.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="var(--brand-orange)" /> 24-48h Guaranteed SLA
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="var(--brand-orange)" /> Real-Time Satellite Telemetry
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="var(--brand-orange)" /> Dedicated Tarmac Priority
                </li>
              </ul>
              <Link href="/book?service=EXP" className="btn btn-secondary btn-sm" style={{ marginTop: 'auto' }}>
                Book Air Express &rarr;
              </Link>
            </div>

            {/* Service 2: Smart Robotic Warehousing */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-cyan)',
                marginBottom: '1.25rem'
              }}>
                <Boxes size={24} />
              </div>
              <h3>Smart Robotic Fulfillment</h3>
              <p style={{ margin: '0.75rem 0 1.25rem 0', fontSize: '0.92rem' }}>
                Autonomous Mobile Robots (AMRs) and multi-level automated sorting lines in our Shenzhen, Hong Kong, and Singapore mega-hubs achieving 18-minute dock-to-dispatch turnaround.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="var(--brand-cyan)" /> 99.99% Order Pick Accuracy
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="var(--brand-cyan)" /> 24/7 Continuous Automated Packing
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="var(--brand-cyan)" /> Direct Integration API for Shopify/ERP
                </li>
              </ul>
              <Link href="/book?service=FUL" className="btn btn-secondary btn-sm" style={{ marginTop: 'auto' }}>
                Explore Fulfillment &rarr;
              </Link>
            </div>

            {/* Service 3: Ocean FCL / LCL Container Freight */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-emerald)',
                marginBottom: '1.25rem'
              }}>
                <Ship size={24} />
              </div>
              <h3>Maritime Container Freight</h3>
              <p style={{ margin: '0.75rem 0 1.25rem 0', fontSize: '0.92rem' }}>
                Ultra-large container vessel capacity securing guaranteed allocations at major terminals including Shanghai Yangshan, Singapore, Rotterdam, and Los Angeles.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="var(--brand-emerald)" /> Full Container (FCL) & Consolidated (LCL)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="var(--brand-emerald)" /> GPS-Monitored Smart E-Seals
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="var(--brand-emerald)" /> Port Drayage & Inland Intermodal
                </li>
              </ul>
              <Link href="/book?service=SEA" className="btn btn-secondary btn-sm" style={{ marginTop: 'auto' }}>
                Book Ocean Freight &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VISUAL INFRASTRUCTURE SPOTLIGHT ================= */}
      <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }} className="spotlight-grid">
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-lg)' }}>
              <img
                src="/images/warehouse.jpg"
                alt="Automated Robotics Sorting Facility"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <div>
              <div className="badge badge-orange" style={{ marginBottom: '0.75rem' }}>
                <Cpu size={13} /> Next-Gen Supply Chain
              </div>
              <h2 style={{ marginBottom: '1rem' }}>Built to Withstand Peak "Double 11" Mega-Surges</h2>
              <p style={{ marginBottom: '1.5rem' }}>
                Traditional logistics networks collapse under sudden 500% volume spikes during global shopping events. Double 11 Logistics was designed from the ground up by <strong>Soben</strong> with elastic cloud dispatch algorithms and robotic buffer sorting.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ color: 'var(--brand-orange)', marginTop: '2px' }}><Zap size={18} /></div>
                  <div>
                    <h4 style={{ fontSize: '1rem' }}>Dynamic Multi-Modal Rerouting</h4>
                    <p style={{ fontSize: '0.88rem' }}>When air corridors experience weather or air-traffic delays, our AI automatically transfers cargo onto high-speed rail or direct expedited sea lines without human delay.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ color: 'var(--brand-cyan)', marginTop: '2px' }}><ShieldCheck size={18} /></div>
                  <div>
                    <h4 style={{ fontSize: '1rem' }}>Instant Green-Lane Customs Filing</h4>
                    <p style={{ fontSize: '0.88rem' }}>Pre-clearance documentation is electronically submitted to US CBP, UK Border Force, and EU Customs while cargo is still in flight, ensuring instantaneous release upon touchdown.</p>
                  </div>
                </div>
              </div>

              <Link href="/about" className="btn btn-primary">
                Learn About Our Architecture & Founder &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MARITIME VISUAL SHOWCASE ================= */}
      <section style={{ padding: '5.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }} className="spotlight-grid">
            <div>
              <div className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
                <Ship size={13} /> Global Maritime Power
              </div>
              <h2 style={{ marginBottom: '1rem' }}>Ultra-Large Vessel Allocations & Green Shipping</h2>
              <p style={{ marginBottom: '1.5rem' }}>
                From 20ft and 40ft High Cube containers to specialized breakbulk machinery, our maritime division manages end-to-end container logistics with real-time satellite AIS tracking and zero port-congestion detention fees.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div className="metric-pill">
                  <span className="metric-number" style={{ fontSize: '1.4rem', color: 'var(--brand-emerald)' }}>48,000 TEU</span>
                  <span className="metric-label">Monthly Vessel Capacity</span>
                </div>
                <div className="metric-pill">
                  <span className="metric-number" style={{ fontSize: '1.4rem', color: 'var(--brand-cyan)' }}>0%</span>
                  <span className="metric-label">Container Rollover Rate</span>
                </div>
              </div>

              <Link href="/book?service=SEA" className="btn btn-secondary">
                Request Container Rate &rarr;
              </Link>
            </div>

            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-lg)' }}>
              <img
                src="/images/ocean.jpg"
                alt="Container Ship at Sea"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section style={{ padding: '5.5rem 0', textAlign: 'center' }}>
        <div className="container-narrow">
          <div className="glass-panel" style={{ padding: '3.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(255, 102, 0, 0.2) 0%, transparent 70%)',
              top: '-50px',
              right: '-50px',
              pointerEvents: 'none'
            }} />

            <div className="badge badge-orange" style={{ marginBottom: '1rem' }}>
              <Sparkles size={13} /> Ready for Takeoff
            </div>

            <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>
              Ready to Upgrade Your Logistics Pipeline?
            </h2>

            <p style={{ maxWidth: '560px', margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
              Book an urgent consignment in less than 2 minutes, get instant transparent waybills, and experience why modern e-commerce leaders trust Double 11.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/book" className="btn btn-primary btn-lg">
                <span>Book a Shipment Now</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/operations" className="btn btn-secondary btn-lg">
                <Cpu size={16} />
                <span>Visit Operations Tower</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 1080px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .spotlight-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .calc-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .calc-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
