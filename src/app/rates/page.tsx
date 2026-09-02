'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sliders,
  Plane,
  Ship,
  Boxes,
  Truck,
  CheckCircle2,
  ArrowRight,
  Info,
  DollarSign
} from 'lucide-react';
import { calculateFreightRate, RateOption } from '../../lib/store';

export default function RatesPage() {
  const [originCountry, setOriginCountry] = useState('HKG');
  const [destCountry, setDestCountry] = useState('USA');
  const [weightKg, setWeightKg] = useState<number>(10);
  const [lengthCm, setLengthCm] = useState<number>(50);
  const [widthCm, setWidthCm] = useState<number>(40);
  const [heightCm, setHeightCm] = useState<number>(30);

  const volumetricWeight = (lengthCm * widthCm * heightCm) / 5000;
  const chargeableWeight = Math.max(weightKg, volumetricWeight);

  const rates: RateOption[] = calculateFreightRate({
    originCountry,
    destCountry,
    weightKg,
    lengthCm,
    widthCm,
    heightCm,
    goodsType: 'General Cargo',
  });

  return (
    <div style={{ padding: '3.5rem 0 6rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>
            <DollarSign size={13} /> Transparent Pricing Architecture
          </div>
          <h1>Rates & Freight Tariffs</h1>
          <p style={{ maxWidth: '640px', margin: '0.5rem auto 0 auto' }}>
            Zero hidden fuel surcharges, guaranteed lane allocations, and dynamic volumetric calculations designed for both high-growth startups and global enterprise brands.
          </p>
        </div>

        {/* Live Interactive Tariff Calculator */}
        <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} color="var(--brand-orange)" />
            <span>Interactive Freight Matrix</span>
          </h3>

          <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
            <div className="input-group">
              <label className="input-label">Origin Gateway</label>
              <select
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                className="select-field"
              >
                <option value="HKG">Hong Kong (HKG Terminal)</option>
                <option value="CHN">Shenzhen / Shanghai (CHN)</option>
                <option value="SGP">Singapore (Changi SIN)</option>
                <option value="JPN">Tokyo (Narita NRT)</option>
                <option value="DEU">Frankfurt (FRA CargoCity)</option>
              </select>
            </div>

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

            <div className="input-group">
              <label className="input-label">Actual Gross Weight (KG)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 1)}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Dimensions (L &times; W &times; H cm)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.25rem' }}>
                <input
                  type="number"
                  placeholder="L"
                  value={lengthCm}
                  onChange={(e) => setLengthCm(parseInt(e.target.value) || 1)}
                  className="input-field"
                  style={{ textAlign: 'center', padding: '0.75rem 0.25rem' }}
                />
                <input
                  type="number"
                  placeholder="W"
                  value={widthCm}
                  onChange={(e) => setWidthCm(parseInt(e.target.value) || 1)}
                  className="input-field"
                  style={{ textAlign: 'center', padding: '0.75rem 0.25rem' }}
                />
                <input
                  type="number"
                  placeholder="H"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value) || 1)}
                  className="input-field"
                  style={{ textAlign: 'center', padding: '0.75rem 0.25rem' }}
                />
              </div>
            </div>
          </div>

          {/* Volumetric calculation banner */}
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
              <Info size={16} color="var(--brand-cyan)" />
              <span>Volumetric Weight: <strong>{volumetricWeight.toFixed(2)} KG</strong> (formula: L &times; W &times; H / 5,000)</span>
            </div>
            <div style={{ fontSize: '0.95rem' }}>
              Billable Chargeable Weight: <strong style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-mono)' }}>{chargeableWeight.toFixed(1)} KG</strong>
            </div>
          </div>

          {/* Rates Cards */}
          <div className="grid grid-cols-4 gap-4">
            {rates.map((tier, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  position: 'relative',
                  border: tier.recommended ? '1px solid var(--brand-orange)' : undefined,
                  background: tier.recommended ? 'rgba(255, 102, 0, 0.05)' : undefined
                }}
              >
                {tier.recommended && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '12px',
                    background: 'var(--brand-orange)',
                    color: '#fff',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tier.serviceCode}</div>
                <h4 style={{ fontSize: '1.1rem', margin: '0.35rem 0' }}>{tier.serviceName}</h4>
                
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-orange)', fontFamily: 'var(--font-mono)', margin: '0.75rem 0' }}>
                  ${tier.estimatedCostUsd} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>USD</span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--brand-emerald)', marginBottom: '1rem' }}>
                  Transit: <strong>{tier.transitDays}</strong>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  {tier.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={13} color="var(--brand-emerald)" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/book?service=${tier.serviceCode}&origin=${originCountry}&dest=${destCountry}&wt=${weightKg}`}
                  className={`btn btn-sm ${tier.recommended ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', marginTop: 'auto' }}
                >
                  Select & Book &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial Tariff Schedule Table */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Standard Published Tariff Schedule (Per KG Rates)</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Base pricing tiers for general cargo departing Hong Kong & Shenzhen Gateways. Volume discounts apply automatically for shipments over 100 KG.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Destination Region</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Double 11 Express (&lt;21 KG)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Express Priority (+45 KG)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Bulk Air Cargo (+100 KG)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Ocean FCL (40ft HC)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>North America (USA / CAN)</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)' }}>$9.80 / kg</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-orange)' }}>$7.20 / kg</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-emerald)' }}>$5.40 / kg</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)' }}>$3,850 flat</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>Western Europe (GBR / DEU / FRA)</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)' }}>$10.20 / kg</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-orange)' }}>$7.80 / kg</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-emerald)' }}>$5.90 / kg</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)' }}>$4,100 flat</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>Southeast Asia (SGP / MYS / THA)</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)' }}>$5.50 / kg</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-orange)' }}>$3.90 / kg</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-emerald)' }}>$2.80 / kg</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)' }}>$1,200 flat</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>Australia & New Zealand (ANZ)</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)' }}>$11.50 / kg</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-orange)' }}>$8.60 / kg</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-emerald)' }}>$6.50 / kg</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)' }}>$2,450 flat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
