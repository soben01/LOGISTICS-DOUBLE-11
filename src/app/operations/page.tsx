'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Search,
  Filter,
  RefreshCw,
  Plane,
  Ship,
  Truck,
  Boxes,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { getShipments, updateShipmentStatus, Shipment } from '../../lib/store';

export default function OperationsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  // Status edit modal state
  const [newStatus, setNewStatus] = useState<Shipment['status']>('In Transit');
  const [newLocation, setNewLocation] = useState('');
  const [newNote, setNewNote] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const loadData = () => {
    setShipments(getShipments());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (s: Shipment) => {
    setEditingShipment(s);
    setNewStatus(s.status);
    setNewLocation(s.destination.city);
    setNewNote(`Dispatched via local hub priority sorting.`);
    setUpdateSuccess(false);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipment) return;

    const updated = updateShipmentStatus(editingShipment.id, newStatus, newLocation, newNote);
    if (updated) {
      setUpdateSuccess(true);
      loadData();
      setTimeout(() => {
        setEditingShipment(null);
        setUpdateSuccess(false);
      }, 1200);
    }
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sender.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && s.status.toUpperCase() === statusFilter.toUpperCase();
  });

  const getStatusBadge = (status: Shipment['status']) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-emerald">Delivered</span>;
      case 'Out for Delivery':
        return <span className="badge badge-amber">Out for Delivery</span>;
      case 'In Transit':
        return <span className="badge badge-orange">In Transit</span>;
      case 'Customs Cleared':
        return <span className="badge badge-cyan">Customs Cleared</span>;
      case 'Pending Pickup':
        return <span className="badge badge-subtle">Pending Pickup</span>;
      default:
        return <span className="badge badge-subtle">{status}</span>;
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem 0' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>
              <Cpu size={13} /> Internal Operations Console
            </div>
            <h1>Logistics Control Tower</h1>
            <p style={{ marginTop: '0.25rem' }}>
              Global dispatch coordination, live fleet tracking, automated hub sorting telemetry, and real-time consignment management.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={loadData} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} />
              <span>Refresh Telemetry</span>
            </button>
            <Link href="/book" className="btn btn-primary btn-sm">
              <span>+ New Consignment</span>
            </Link>
          </div>
        </div>

        {/* Fleet KPI Metric Cards */}
        <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
          <div className="metric-pill">
            <span className="metric-number" style={{ color: 'var(--brand-orange)' }}>{shipments.length}</span>
            <span className="metric-label">Active Consignments</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>100% telemetry synced</span>
          </div>

          <div className="metric-pill">
            <span className="metric-number" style={{ color: 'var(--brand-emerald)' }}>99.8%</span>
            <span className="metric-label">Nepal On-Time SLA</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Zero SLA breaches today</span>
          </div>

          <div className="metric-pill">
            <span className="metric-number" style={{ color: 'var(--brand-cyan)' }}>77 Districts</span>
            <span className="metric-label">Nationwide Domestic Reach</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>All 7 Provinces linehaul active</span>
          </div>

          <div className="metric-pill">
            <span className="metric-number" style={{ color: 'var(--brand-amber)' }}>Coming Soon</span>
            <span className="metric-label">International Air Cargo</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>TIA Air Terminal (Q4 2026)</span>
          </div>
        </div>

        {/* Mega-Hub Live Capacity Monitor */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Boxes size={18} color="var(--brand-orange)" />
              <span>Nepal Domestic Regional Hub Capacity &amp; Telemetry</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--brand-emerald)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="pulse-dot pulse-dot-green" style={{ width: 6, height: 6 }} /> All Sort Facilities Online
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* Kathmandu */}
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <strong>Kathmandu Central Mega-Hub</strong>
                <span style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>94%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '94%', height: '100%', background: 'var(--brand-orange)' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Peak automated sorting (12,000 pk/hr)</div>
            </div>

            {/* Pokhara */}
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <strong>Pokhara (PKR) Gandaki Gateway</strong>
                <span style={{ color: 'var(--brand-emerald)', fontWeight: 700 }}>76%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '76%', height: '100%', background: 'var(--brand-emerald)' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Normal Flow: Prithvi highway express unit</div>
            </div>

            {/* Birgunj */}
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <strong>Birgunj Inland Dry Port Hub</strong>
                <span style={{ color: 'var(--brand-cyan)', fontWeight: 700 }}>88%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '88%', height: '100%', background: 'var(--brand-cyan)' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>High Flow: Cross-corridor heavy freight</div>
            </div>

            {/* Biratnagar */}
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <strong>Biratnagar Koshi Hub</strong>
                <span style={{ color: 'var(--brand-emerald)', fontWeight: 700 }}>72%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '72%', height: '100%', background: 'var(--brand-emerald)' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Normal Flow: East Nepal e-commerce dispatch</div>
            </div>
          </div>
        </div>

        {/* Consignment Management Table */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Active Consignment Manifest</h3>

            {/* Search & Status Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter by AWB, city, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.25rem', width: '240px', fontSize: '0.85rem' }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select-field"
                style={{ width: '170px', fontSize: '0.85rem' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="IN TRANSIT">In Transit</option>
                <option value="OUT FOR DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CUSTOMS CLEARED">Customs Cleared</option>
                <option value="PENDING PICKUP">Pending Pickup</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Tracking ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Service</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Route</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Weight & Cargo</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '1rem' }}>
                      <Link href={`/track?id=${s.id}`} style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--brand-orange)', textDecoration: 'underline' }}>
                        {s.id}
                      </Link>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {s.telemetry.waybillNumber || s.telemetry.airwayBill}
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 600 }}>{s.service}</span>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{s.origin.city} &rarr; {s.destination.city}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>To: {s.recipient.name}</div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div>{s.cargo.weightKg} KG &middot; {s.cargo.pieces} Pcs</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.cargo.description}
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {getStatusBadge(s.status)}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                        >
                          <Edit3 size={13} /> Update Status
                        </button>
                        <Link
                          href={`/track?id=${s.id}`}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                        >
                          Telemetry &rarr;
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Status Modal */}
        {editingShipment && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '1.5rem'
          }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '2rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem' }}>Update Consignment Status</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--brand-orange)', fontFamily: 'var(--font-mono)' }}>
                    {editingShipment.id}
                  </span>
                </div>
                <button
                  onClick={() => setEditingShipment(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveStatus} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="input-label">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Shipment['status'])}
                    className="select-field"
                  >
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered (Signs POD)</option>
                    <option value="Customs Cleared">Customs Cleared</option>
                    <option value="Pending Pickup">Pending Pickup</option>
                    <option value="Exception">Exception / Delay</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Current Location / Waypoint</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Milestone Checkpoint Note</label>
                  <textarea
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="textarea-field"
                    required
                  />
                </div>

                {updateSuccess && (
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: 'var(--brand-emerald)',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <CheckCircle2 size={16} /> Status updated & synched to tracking database!
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setEditingShipment(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Check size={16} />
                    <span>Apply Status Update</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
