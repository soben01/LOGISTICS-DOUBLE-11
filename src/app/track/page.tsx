'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Plane,
  Ship,
  Truck,
  Boxes,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Share2,
  Bell,
  ArrowRight,
  FileText,
  Thermometer,
  Gauge,
  UserCheck,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { getShipmentById, getShipments, Shipment, Checkpoint } from '../../lib/store';

function TrackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryId = searchParams.get('id') || '';

  const [searchInput, setSearchInput] = useState(queryId);
  const [currentShipment, setCurrentShipment] = useState<Shipment | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [subscribedNotifications, setSubscribedNotifications] = useState(false);

  useEffect(() => {
    if (queryId) {
      setSearchInput(queryId);
      const found = getShipmentById(queryId);
      if (found) {
        setCurrentShipment(found);
        setNotFound(false);
      } else {
        setCurrentShipment(null);
        setNotFound(true);
      }
    } else {
      // Default to the first sample shipment
      const defaultShipment = getShipmentById('D11-8892-EXP');
      if (defaultShipment) {
        setCurrentShipment(defaultShipment);
        setSearchInput('D11-8892-EXP');
      }
    }
  }, [queryId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/track?id=${encodeURIComponent(searchInput.trim())}`);
  };

  const handleSelectSample = (id: string) => {
    setSearchInput(id);
    router.push(`/track?id=${id}`);
  };

  const copyTrackingLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getStatusBadgeClass = (status: Shipment['status']) => {
    switch (status) {
      case 'Delivered':
        return 'badge-emerald';
      case 'Out for Delivery':
        return 'badge-amber';
      case 'In Transit':
        return 'badge-orange';
      case 'Customs Cleared':
        return 'badge-cyan';
      default:
        return 'badge-subtle';
    }
  };

  const getServiceIcon = (code: Shipment['serviceCode']) => {
    switch (code) {
      case 'EXP':
      case 'AIR':
        return <Plane size={20} color="var(--brand-orange)" />;
      case 'SEA':
        return <Ship size={20} color="var(--brand-cyan)" />;
      default:
        return <Truck size={20} color="var(--brand-amber)" />;
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem 0' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div className="badge badge-orange" style={{ marginBottom: '0.75rem' }}>
            <RadioPulse /> Live Telemetry
          </div>
          <h1>Consignment Tracking Center</h1>
          <p style={{ maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            Real-time multi-modal satellite tracking, waypoint telemetry, and digital customs status across our global air, maritime, and ground networks.
          </p>
        </div>

        {/* Search Bar & Sample Pills */}
        <div className="glass-panel" style={{ padding: '1.75rem 2rem', maxWidth: '820px', margin: '0 auto 3rem auto' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Enter Consignment or AWB # (e.g. D11-8892-EXP)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.75rem', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              <span>Search Telemetry</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Click Samples */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Demo Shipments:</span>
            <button
              type="button"
              onClick={() => handleSelectSample('D11-8892-EXP')}
              className={`badge ${currentShipment?.id === 'D11-8892-EXP' ? 'badge-orange' : 'badge-subtle'}`}
              style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
            >
              D11-8892-EXP (Transpacific Air)
            </button>
            <button
              type="button"
              onClick={() => handleSelectSample('D11-4410-SEA')}
              className={`badge ${currentShipment?.id === 'D11-4410-SEA' ? 'badge-cyan' : 'badge-subtle'}`}
              style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
            >
              D11-4410-SEA (Ocean Container)
            </button>
            <button
              type="button"
              onClick={() => handleSelectSample('D11-9921-AIR')}
              className={`badge ${currentShipment?.id === 'D11-9921-AIR' ? 'badge-amber' : 'badge-subtle'}`}
              style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
            >
              D11-9921-AIR (Out for Delivery)
            </button>
            <button
              type="button"
              onClick={() => handleSelectSample('D11-2041-LOC')}
              className={`badge ${currentShipment?.id === 'D11-2041-LOC' ? 'badge-emerald' : 'badge-subtle'}`}
              style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
            >
              D11-2041-LOC (Delivered POD)
            </button>
          </div>
        </div>

        {/* Not Found State */}
        {notFound && (
          <div className="card" style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: 'var(--brand-red)'
            }}>
              <AlertCircle size={28} />
            </div>
            <h3>Consignment Not Found</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              No active shipment matches tracking ID <strong>{searchInput}</strong> in our network database. Please verify the number or book a new shipment.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button onClick={() => handleSelectSample('D11-8892-EXP')} className="btn btn-secondary btn-sm">
                Load Active Sample
              </button>
              <Link href="/book" className="btn btn-primary btn-sm">
                Book New Shipment &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Active Shipment Display */}
        {currentShipment && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '2rem' }} className="track-layout">
            {/* Left: Journey Progress & Checkpoints */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Header Box */}
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                      <span className={`badge ${getStatusBadgeClass(currentShipment.status)}`}>
                        {currentShipment.status}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Service: <strong>{currentShipment.service}</strong>
                      </span>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.85rem', color: '#ffffff' }}>
                      {currentShipment.id}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={copyTrackingLink}
                      className="btn btn-secondary btn-sm"
                      title="Share link"
                    >
                      <Share2 size={14} />
                      <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubscribedNotifications(!subscribedNotifications)}
                      className={`btn btn-sm ${subscribedNotifications ? 'btn-primary' : 'btn-outline'}`}
                    >
                      <Bell size={14} />
                      <span>{subscribedNotifications ? 'Subscribed' : 'Alerts'}</span>
                    </button>
                  </div>
                </div>

                {/* Origin -> Destination Visual Banner */}
                <div style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  alignItems: 'center',
                  gap: '1.5rem',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORIGIN GATEWAY</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                      {currentShipment.origin.city}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--brand-orange)' }}>
                      {currentShipment.origin.hub}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'rgba(255, 102, 0, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getServiceIcon(currentShipment.serviceCode)}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      &rarr; TRANSIT &rarr;
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DESTINATION</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                      {currentShipment.destination.city}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--brand-cyan)' }}>
                      {currentShipment.destination.hub}
                    </div>
                  </div>
                </div>

                {/* Estimated Delivery Strip */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={16} color="var(--brand-amber)" /> Estimated Arrival:
                  </span>
                  <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    {currentShipment.telemetry.estimatedArrival}
                  </strong>
                </div>
              </div>

              {/* Checkpoints Timeline */}
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} color="var(--brand-orange)" />
                  <span>Milestone Telemetry Timeline</span>
                </h3>

                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                  {/* Vertical connecting line */}
                  <div style={{
                    position: 'absolute',
                    left: '9px',
                    top: '12px',
                    bottom: '12px',
                    width: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)'
                  }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    {currentShipment.checkpoints.map((cp, idx) => (
                      <div key={cp.id} style={{ position: 'relative' }}>
                        {/* Dot indicator */}
                        <div style={{
                          position: 'absolute',
                          left: '-2rem',
                          top: '3px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: idx === 0 ? 'var(--brand-orange)' : 'var(--bg-card)',
                          border: idx === 0 ? '3px solid rgba(255, 102, 0, 0.3)' : '2px solid var(--border-medium)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: idx === 0 ? '0 0 12px var(--brand-orange)' : undefined
                        }}>
                          {idx === 0 && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: idx === 0 ? '#ffffff' : 'var(--text-secondary)' }}>
                              {cp.status} &mdash; {cp.location}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              {cp.timestamp}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                            {cp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Digital Proof of Delivery (if delivered) */}
              {currentShipment.proofOfDelivery && (
                <div className="card" style={{ padding: '2rem', border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--brand-emerald)' }}>
                    <UserCheck size={22} />
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--brand-emerald)' }}>Official Proof of Delivery (POD)</h3>
                  </div>

                  <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    This consignment has been verified and securely handed over to the authorized recipient.
                  </p>

                  <div style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DELIVERED TIMESTAMP</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                        {currentShipment.proofOfDelivery.deliveredAt}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RECEIVED BY</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                        {currentShipment.proofOfDelivery.receivedBy}
                      </div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>SIGNATURE VERIFICATION</div>
                      <div style={{
                        padding: '0.75rem 1rem',
                        background: '#090e18',
                        borderRadius: '6px',
                        border: '1px dashed rgba(255, 255, 255, 0.15)',
                        fontFamily: 'cursive, serif',
                        fontSize: '1.1rem',
                        color: 'var(--brand-emerald)'
                      }}>
                        {currentShipment.proofOfDelivery.signatureText}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Consignment Specs & Live Telemetry Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Telemetry Hardware Card */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Gauge size={17} color="var(--brand-cyan)" />
                  <span>Transport Vehicle Telemetry</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Carrier Unit:</span>
                    <strong style={{ color: '#ffffff' }}>{currentShipment.telemetry.flightVesselNumber}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Airway Bill / BOL:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-orange)' }}>
                      {currentShipment.telemetry.airwayBill}
                    </span>
                  </div>

                  {currentShipment.telemetry.containerUnit && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Container Number:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                        {currentShipment.telemetry.containerUnit}
                      </span>
                    </div>
                  )}

                  {currentShipment.telemetry.temperatureCelsius !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Thermometer size={14} color="var(--brand-cyan)" /> Cargo Temp:
                      </span>
                      <strong style={{ color: 'var(--brand-cyan)', fontFamily: 'var(--font-mono)' }}>
                        {currentShipment.telemetry.temperatureCelsius}&deg;C (Optimal)
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Cargo Specification Card */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Boxes size={17} color="var(--brand-amber)" />
                  <span>Cargo Manifest & Spec</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>COMMODITY DESCRIPTION</span>
                    <div style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>
                      {currentShipment.cargo.description}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <div className="metric-pill" style={{ padding: '0.75rem' }}>
                      <span className="metric-number" style={{ fontSize: '1.2rem', color: '#ffffff' }}>
                        {currentShipment.cargo.weightKg} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>KG</span>
                      </span>
                      <span className="metric-label" style={{ fontSize: '0.7rem' }}>Gross Weight</span>
                    </div>

                    <div className="metric-pill" style={{ padding: '0.75rem' }}>
                      <span className="metric-number" style={{ fontSize: '1.2rem', color: '#ffffff' }}>
                        {currentShipment.cargo.pieces} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>PCS</span>
                      </span>
                      <span className="metric-label" style={{ fontSize: '0.7rem' }}>Colli Count</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Declared Value:</span>
                    <strong style={{ color: 'var(--brand-emerald)', fontFamily: 'var(--font-mono)' }}>
                      ${currentShipment.cargo.declaredValueUsd.toLocaleString()} USD
                    </strong>
                  </div>
                </div>
              </div>

              {/* Dispatch Action shortcuts */}
              <div className="card" style={{ padding: '1.5rem', background: 'rgba(255, 102, 0, 0.03)', border: '1px solid rgba(255, 102, 0, 0.2)' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#ffffff' }}>Operations Controls</h4>
                <p style={{ fontSize: '0.82rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  Need to adjust this shipment or update its status? Dispatch agents can access the Control Tower.
                </p>
                <Link href="/operations" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  Manage in Operations Tower &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 850px) {
          .track-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function RadioPulse() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-orange)', fontWeight: 600 }}>
      <span className="pulse-dot" style={{ width: 7, height: 7, background: 'var(--brand-orange)', boxShadow: '0 0 8px var(--brand-orange)' }}></span>
      Live Sat Telemetry
    </span>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading live tracking telemetry...
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
