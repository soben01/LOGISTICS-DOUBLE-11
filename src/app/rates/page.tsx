'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sliders,
  DollarSign,
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Boxes,
  Truck,
  Plane,
  Globe2,
  HelpCircle,
  Clock
} from 'lucide-react';
import { calculateDomesticFreightRate, DomesticRateOption } from '../../lib/store';
import { getCurrentUser, User } from '../../lib/auth';

export default function RatesPage() {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const [originCity, setOriginCity] = useState('Kathmandu');
  const [destCity, setDestCity] = useState('Pokhara');
  const [weightKg, setWeightKg] = useState<number>(5);
  const [lengthCm, setLengthCm] = useState<number>(30);
  const [widthCm, setWidthCm] = useState<number>(20);
  const [heightCm, setHeightCm] = useState<number>(20);

  const rates: DomesticRateOption[] = calculateDomesticFreightRate({
    originCity,
    destCity,
    weightKg,
    lengthCm,
    widthCm,
    heightCm
  });

  const volumetricWeight = (lengthCm * widthCm * heightCm) / 5000;
  const chargeableWeight = Math.max(weightKg, volumetricWeight).toFixed(1);

  return (
    <div style={{ padding: '4rem 0 6rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="badge badge-orange" style={{ marginBottom: '0.75rem' }}>
            <Truck size={13} /> NEPAL DOMESTIC TARIFFS &bull; ALL 77 DISTRICTS
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Published Freight Tariffs &amp; Pricing
          </h1>
          <p style={{ maxWidth: '680px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Transparent, all-inclusive rates for same-day Kathmandu Valley dispatch, 24-hour intercity linehauls, and nationwide delivery. International cargo rates launching Q4 2026.
          </p>
        </div>

        {/* Live Interactive Tariff Calculator */}
        <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} color="var(--brand-orange)" />
            <span>Interactive Domestic Freight Calculator</span>
          </h3>

          <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
            <div className="input-group">
              <label className="input-label">Origin Hub</label>
              <select
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="select-field"
              >
                <option value="Kathmandu">Kathmandu (Central Mega-Hub)</option>
                <option value="Lalitpur">Lalitpur (Patan Hub)</option>
                <option value="Bhaktapur">Bhaktapur (East Valley Hub)</option>
                <option value="Pokhara">Pokhara (Gandaki Hub)</option>
                <option value="Birgunj">Birgunj (Dry Port Trade Hub)</option>
                <option value="Biratnagar">Biratnagar (Eastern Hub)</option>
                <option value="Chitwan">Chitwan (Bharatpur Gateway)</option>
                <option value="Butwal">Butwal (Lumbini Corridor)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Destination City / Area</label>
              <select
                value={destCity}
                onChange={(e) => setDestCity(e.target.value)}
                className="select-field"
              >
                <option value="Pokhara">Pokhara (Gandaki Province)</option>
                <option value="Kathmandu">Kathmandu Valley</option>
                <option value="Biratnagar">Biratnagar (Koshi Province)</option>
                <option value="Birgunj">Birgunj (Madhesh Province)</option>
                <option value="Chitwan">Chitwan / Narayangarh</option>
                <option value="Butwal">Butwal / Bhairahawa</option>
                <option value="Dharan">Dharan / Itahari</option>
                <option value="Nepalgunj">Nepalgunj (Banke)</option>
                <option value="Dhangadhi">Dhangadhi (Far-West)</option>
                <option value="Nationwide">Rest of Nepal (77 Districts)</option>
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

          <div style={{
            background: 'rgba(255, 102, 0, 0.05)',
            border: '1px solid rgba(255, 102, 0, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Info size={18} color="var(--brand-orange)" />
              <span style={{ fontSize: '0.85rem' }}>
                Chargeable Weight Formula: <strong>MAX(Actual Weight, L&times;W&times;H / 5000)</strong>
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
              Volumetric: <strong>{volumetricWeight.toFixed(2)} KG</strong> &bull; Chargeable: <strong style={{ color: 'var(--brand-orange)', fontSize: '1.1rem' }}>{chargeableWeight} KG</strong>
            </div>
          </div>

          {/* Rate Cards Display */}
          <div className="grid grid-cols-4 gap-4">
            {rates.map((rate, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  border: rate.isComingSoon
                    ? '1px dashed rgba(245, 158, 11, 0.4)'
                    : rate.recommended
                    ? '1px solid var(--brand-orange)'
                    : undefined,
                  background: rate.isComingSoon
                    ? 'rgba(245, 158, 11, 0.03)'
                    : rate.recommended
                    ? 'rgba(255, 102, 0, 0.04)'
                    : undefined,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {rate.isComingSoon ? (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '15px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#000000',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '10px',
                    letterSpacing: '0.05em'
                  }}>
                    COMING SOON
                  </div>
                ) : rate.recommended && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '15px',
                    background: 'var(--brand-orange)',
                    color: '#fff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '10px',
                    letterSpacing: '0.05em'
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{rate.serviceCode}</div>
                <h4 style={{ fontSize: '1.15rem', margin: '0.2rem 0 0.75rem 0' }}>{rate.serviceName}</h4>

                <div style={{ marginBottom: '0.75rem' }}>
                  {rate.isComingSoon ? (
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-amber)' }}>
                      Coming Soon
                    </div>
                  ) : (
                    <>
                      <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                        Rs. {rate.estimatedCostNpr}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}> NPR total</span>
                    </>
                  )}
                </div>

                <div style={{
                  fontSize: '0.82rem',
                  color: rate.isComingSoon ? 'var(--brand-amber)' : 'var(--brand-emerald)',
                  fontWeight: 600,
                  marginBottom: '1rem'
                }}>
                  {rate.transitDays}
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  {rate.features.map((feature, fIdx) => (
                    <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={13} color={rate.isComingSoon ? 'var(--brand-amber)' : 'var(--brand-orange)'} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {rate.isComingSoon ? (
                  <a href="#intl-notice" className="btn btn-outline btn-sm" style={{ marginTop: 'auto', textAlign: 'center', borderColor: 'var(--brand-amber)', color: 'var(--brand-amber)' }}>
                    Register for Launch &rarr;
                  </a>
                ) : (
                  <Link
                    href={currentUser ? `/book?service=${rate.serviceCode}` : `/login?redirect=/book`}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: 'auto', textAlign: 'center' }}
                  >
                    {currentUser ? "Book Consignment \u2192" : "Login to Book \u2192"}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Official Published Tariff Schedule Table */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
            Published Domestic Standard Tariff Schedule
          </h2>

          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Zone / Delivery Destination</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Transit Guarantee</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Base Tariff (First 1 KG)</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Addl. Per KG</th>
                  <th style={{ padding: '1rem 1.25rem' }}>COD Processing Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600 }}>
                    <div>Kathmandu Valley Rush</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kathmandu, Lalitpur, Bhaktapur</div>
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem', color: 'var(--brand-emerald)', fontWeight: 600 }}>Same-Day (3-6h)</td>
                  <td style={{ padding: '1.1rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff' }}>Rs. 120</td>
                  <td style={{ padding: '1.1rem 1.25rem', fontFamily: 'var(--font-mono)' }}>Rs. 40 / kg</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: 'var(--brand-emerald)' }}>FREE (0%)</td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600 }}>
                    <div>Major Intercity Express Corridors</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pokhara, Birgunj, Biratnagar, Chitwan, Butwal</div>
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem', color: 'var(--brand-orange)', fontWeight: 600 }}>24h Next-Day Guaranteed</td>
                  <td style={{ padding: '1.1rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff' }}>Rs. 180</td>
                  <td style={{ padding: '1.1rem 1.25rem', fontFamily: 'var(--font-mono)' }}>Rs. 55 / kg</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: 'var(--brand-emerald)' }}>1.5% Remittance</td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600 }}>
                    <div>Regional District Trade Hubs</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dharan, Itahari, Nepalgunj, Dhangadhi, Hetauda</div>
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem', color: 'var(--text-secondary)' }}>24 - 48 Hours</td>
                  <td style={{ padding: '1.1rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff' }}>Rs. 220</td>
                  <td style={{ padding: '1.1rem 1.25rem', fontFamily: 'var(--font-mono)' }}>Rs. 65 / kg</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: 'var(--brand-emerald)' }}>1.5% Remittance</td>
                </tr>

                <tr>
                  <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600 }}>
                    <div>All 77 Districts &bull; Hill / Mountain Lanes</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jumla, Mustang, Solukhumbu, Ilam, Baitadi, etc.</div>
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem', color: 'var(--text-secondary)' }}>2 - 3 Days</td>
                  <td style={{ padding: '1.1rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff' }}>Rs. 290</td>
                  <td style={{ padding: '1.1rem 1.25rem', fontFamily: 'var(--font-mono)' }}>Rs. 85 / kg</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: 'var(--brand-emerald)' }}>2.0% Remittance</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* International Notice Banner */}
        <div id="intl-notice" className="glass-panel" style={{
          padding: '2.5rem',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.07) 0%, rgba(13, 20, 36, 0.8) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-amber)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <Globe2 size={16} /> INTERNATIONAL AIR CARGO &bull; COMING SOON (Q4 2026)
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              Expanding Nepal Exporters to Dubai, India, China &amp; the World
            </h3>
            <p style={{ maxWidth: '650px', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Direct scheduled air freight flights operating out of Tribhuvan International Airport (TIA) are in final regulatory review with the Civil Aviation Authority and Nepal Customs. Register your merchant account today to secure introductory export tariffs.
            </p>
          </div>

          <Link href="/#international-waitlist" className="btn btn-primary" style={{ flexShrink: 0 }}>
            <span>Join Priority Waitlist</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
