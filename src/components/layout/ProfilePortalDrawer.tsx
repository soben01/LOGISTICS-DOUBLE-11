'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  ShieldCheck,
  Building,
  Truck,
  Boxes,
  Banknote,
  FileText,
  Settings,
  LogOut,
  X,
  ChevronRight,
  ArrowRight,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Users,
  ShieldAlert
} from 'lucide-react';
import {
  User,
  loginUser,
  logoutUser,
  updateUserSubRole
} from '../../lib/auth';

interface ProfilePortalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

const MERCHANT_SUB_ROLES = [
  {
    id: 'Merchant Consignor / Shipper',
    label: 'Merchant Consignor / Shipper',
    desc: 'Primary merchant authority for booking orders & managing shipments.',
    icon: Building,
    badgeColor: 'var(--brand-cyan)',
    badgeBg: 'rgba(6, 182, 212, 0.15)'
  },
  {
    id: 'Warehouse Dispatcher',
    label: 'Warehouse Dispatcher',
    desc: 'Sorting, packaging, barcode scanning, and AWB manifest printing.',
    icon: Boxes,
    badgeColor: 'var(--brand-emerald)',
    badgeBg: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 'Finance & COD Accountant',
    label: 'Finance & COD Accountant',
    desc: 'Cash collection verification, remittance ledger, and bank settlement.',
    icon: Banknote,
    badgeColor: 'var(--brand-amber)',
    badgeBg: 'rgba(245, 158, 11, 0.15)'
  }
];

const ADMIN_SUB_ROLES = [
  {
    id: 'Command HQ / Super Admin',
    label: 'Command HQ / Super Admin',
    desc: 'Full operational control, database telemetry, and platform permissions.',
    icon: ShieldCheck,
    badgeColor: 'var(--brand-orange)',
    badgeBg: 'rgba(255, 102, 0, 0.18)'
  },
  {
    id: 'Operations & Hub Controller',
    label: 'Operations & Hub Controller',
    desc: 'Intercity linehaul dispatch, hub sort capacity, and transit SLAs.',
    icon: Truck,
    badgeColor: 'var(--brand-cyan)',
    badgeBg: 'rgba(6, 182, 212, 0.15)'
  },
  {
    id: 'Compliance & Security Auditor',
    label: 'Compliance & Security Auditor',
    desc: 'Audit trails, merchant KYC verification, and dispute resolution.',
    icon: ShieldAlert,
    badgeColor: '#a855f7',
    badgeBg: 'rgba(168, 85, 247, 0.15)'
  }
];

export default function ProfilePortalDrawer({
  isOpen,
  onClose,
  currentUser
}: ProfilePortalDrawerProps) {
  const router = useRouter();

  // Sub-Login Form States (for Guests or role switching)
  const [loginTab, setLoginTab] = useState<'merchant' | 'admin'>('merchant');
  const [selectedSubRole, setSelectedSubRole] = useState<string>(
    loginTab === 'admin' ? 'Command HQ / Super Admin' : 'Merchant Consignor / Shipper'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Sub-Role switcher state for logged-in user
  const [roleSwitchSuccess, setRoleSwitchSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubRoleChange = (newSubRole: string) => {
    updateUserSubRole(newSubRole);
    setRoleSwitchSuccess(`Active role switched to: ${newSubRole}`);
    setTimeout(() => setRoleSwitchSuccess(''), 2500);
  };

  const handleSubLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    setTimeout(() => {
      const res = loginUser(email, password, selectedSubRole);
      setLoginLoading(false);
      if (!res.success) {
        setLoginError(res.error || 'Login failed. Please check credentials.');
      } else {
        onClose();
        router.push('/dashboard');
      }
    }, 200);
  };

  const handleLogout = () => {
    logoutUser();
    onClose();
    router.push('/');
  };

  const currentSubRoles = currentUser?.role === 'admin' ? ADMIN_SUB_ROLES : MERCHANT_SUB_ROLES;
  const activeRoleObj = currentSubRoles.find(r => r.id === (currentUser?.subRole || currentSubRoles[0].id)) || currentSubRoles[0];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(5, 8, 16, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Click outside backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          cursor: 'pointer'
        }}
      />

      {/* Drawer Container */}
      <div style={{
        position: 'relative',
        zIndex: 10000,
        width: '100%',
        maxWidth: '480px',
        height: '100vh',
        backgroundColor: 'rgba(10, 15, 29, 0.98)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.9)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: currentUser?.role === 'admin'
                ? 'linear-gradient(135deg, #ff6600 0%, #b33900 100%)'
                : 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800
            }}>
              {currentUser?.role === 'admin' ? <ShieldCheck size={20} /> : <UserIcon size={18} />}
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem', letterSpacing: '-0.01em' }}>
                {currentUser ? 'My Profile & Portal Hub' : 'Portal Sub-Login & Profile'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Double 11 Logistics Enterprise Access
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Profile Drawer"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '0.4rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>

          {/* ================= SECTION A: USER IS AUTHENTICATED ================= */}
          {currentUser ? (
            <>
              {/* Profile Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: currentUser.role === 'admin' ? '1px solid rgba(255, 102, 0, 0.3)' : '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                padding: '1.25rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '100px',
                  height: '100px',
                  background: currentUser.role === 'admin' ? 'rgba(255, 102, 0, 0.12)' : 'rgba(6, 182, 212, 0.12)',
                  borderRadius: '50%',
                  filter: 'blur(30px)',
                  pointerEvents: 'none'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
                      {currentUser.name}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: currentUser.role === 'admin' ? 'var(--brand-orange)' : 'var(--brand-cyan)', fontWeight: 600, marginTop: '0.2rem' }}>
                      {currentUser.company}
                    </div>
                  </div>

                  <span className={currentUser.role === 'admin' ? 'badge badge-orange' : 'badge badge-cyan'} style={{ fontSize: '0.68rem', padding: '0.2rem 0.6rem' }}>
                    {currentUser.role === 'admin' ? 'SYSTEM ADMIN' : 'VERIFIED MERCHANT'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={13} style={{ color: 'var(--text-muted)' }} />
                    <span>{currentUser.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={13} style={{ color: 'var(--text-muted)' }} />
                    <span>{currentUser.phone}</span>
                  </div>
                </div>

                {currentUser.role === 'merchant' && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.65rem 0.85rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--brand-emerald)', fontWeight: 600 }}>
                      COD Unsettled Balance:
                    </span>
                    <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#ffffff' }}>
                      Rs. {currentUser.codBalanceNpr.toLocaleString()} NPR
                    </strong>
                  </div>
                )}
              </div>

              {/* Sub-Class Role Selection */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.6rem'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em' }}>
                    ACTIVE SUB-CLASS ROLE:
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    color: activeRoleObj.badgeColor,
                    background: activeRoleObj.badgeBg,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    {activeRoleObj.label}
                  </span>
                </div>

                {roleSwitchSuccess && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--brand-emerald)',
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <CheckCircle2 size={13} />
                    <span>{roleSwitchSuccess}</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {currentSubRoles.map((role) => {
                    const isCurrent = (currentUser.subRole || currentSubRoles[0].id) === role.id;
                    const IconComp = role.icon;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleSubRoleChange(role.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.85rem',
                          background: isCurrent ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.02)',
                          border: isCurrent ? `1px solid ${role.badgeColor}` : '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{
                            color: role.badgeColor,
                            background: role.badgeBg,
                            padding: '0.35rem',
                            borderRadius: '6px',
                            display: 'flex'
                          }}>
                            <IconComp size={15} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                              {role.label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>
                              {role.desc}
                            </div>
                          </div>
                        </div>
                        {isCurrent && (
                          <span style={{ fontSize: '0.65rem', color: role.badgeColor, fontWeight: 800 }}>
                            ACTIVE
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Relative Portal Navigation: All Required Sections */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
                  {currentUser.role === 'admin' ? 'ADMIN PORTAL SECTIONS:' : 'MERCHANT PORTAL SECTIONS:'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {currentUser.role === 'merchant' && (
                    <>
                      <Link
                        href="/merchant#shipments"
                        onClick={onClose}
                        className="profile-portal-link"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <Boxes size={16} color="var(--brand-cyan)" />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>Consignment Registry &amp; History</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Live statuses, delivery tracking, customer OTPs</div>
                          </div>
                        </div>
                        <ChevronRight size={15} color="var(--text-muted)" />
                      </Link>

                      <Link
                        href="/merchant#cod"
                        onClick={onClose}
                        className="profile-portal-link"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <Banknote size={16} color="var(--brand-emerald)" />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>COD Remittance &amp; Bank Settlement</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Daily collected cash, bank ledger, auto-remittance</div>
                          </div>
                        </div>
                        <ChevronRight size={15} color="var(--text-muted)" />
                      </Link>

                      <Link
                        href="/book"
                        onClick={onClose}
                        className="profile-portal-link"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <Truck size={16} color="var(--brand-orange)" />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>New Consignment Booking</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Instant 4-step domestic dispatch to 77 districts</div>
                          </div>
                        </div>
                        <ChevronRight size={15} color="var(--text-muted)" />
                      </Link>

                      <Link
                        href="/bookings"
                        onClick={onClose}
                        className="profile-portal-link"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <Boxes size={16} color="var(--brand-orange)" />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>All Bookings Data Registry</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pure booking records, customer data, and AWB manifests</div>
                          </div>
                        </div>
                        <ChevronRight size={15} color="var(--text-muted)" />
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={onClose}
                        className="profile-portal-link"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <Cpu size={16} color="var(--brand-cyan)" />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>Operations &amp; Fleet Dashboard</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Live telemetry metrics, hub sorting capacity, and SLA</div>
                          </div>
                        </div>
                        <ChevronRight size={15} color="var(--text-muted)" />
                      </Link>
                    </>
                  )}

                  {currentUser.role === 'admin' && (
                    <>
                      <Link
                        href="/admin"
                        onClick={onClose}
                        className="profile-portal-link"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <ShieldCheck size={16} color="var(--brand-orange)" />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>Master Control Tower</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>System oversight, fleet metrics, D1 database status</div>
                          </div>
                        </div>
                        <ChevronRight size={15} color="var(--text-muted)" />
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={onClose}
                        className="profile-portal-link"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <Cpu size={16} color="var(--brand-cyan)" />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>Operations &amp; Fleet Dashboard</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Accurate live telemetry, hub load distribution</div>
                          </div>
                        </div>
                        <ChevronRight size={15} color="var(--text-muted)" />
                      </Link>

                      <Link
                        href="/bookings"
                        onClick={onClose}
                        className="profile-portal-link"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <Boxes size={16} color="var(--brand-amber)" />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>All Bookings Data Registry</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Consignment records, customer search, status updates</div>
                          </div>
                        </div>
                        <ChevronRight size={15} color="var(--text-muted)" />
                      </Link>

                      <Link
                        href="/admin#merchants"
                        onClick={onClose}
                        className="profile-portal-link"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <Users size={16} color="var(--brand-emerald)" />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>Merchant Accounts &amp; Payouts</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Approve merchants, verify KYC, audit COD transfers</div>
                          </div>
                        </div>
                        <ChevronRight size={15} color="var(--text-muted)" />
                      </Link>

                      <Link
                        href="/rates"
                        onClick={onClose}
                        className="profile-portal-link"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <FileText size={16} color="var(--brand-amber)" />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>Tariffs &amp; Pricing Management</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>National freight rates, Valley rush pricing</div>
                          </div>
                        </div>
                        <ChevronRight size={15} color="var(--text-muted)" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Portal Sub-Login Switcher */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '1rem',
                marginTop: 'auto'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                  SWITCH PORTAL CONSOLE:
                </div>
                {currentUser.role === 'merchant' ? (
                  <Link
                    href="/login?portal=admin&redirect=/admin"
                    onClick={onClose}
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
                  >
                    <ShieldCheck size={14} color="var(--brand-orange)" />
                    <span>Admin Control Tower Sub-Login</span>
                  </Link>
                ) : (
                  <Link
                    href="/merchant"
                    onClick={onClose}
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
                  >
                    <Building size={14} color="var(--brand-cyan)" />
                    <span>View Merchant Portal View</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem', color: '#ef4444' }}
                >
                  <LogOut size={14} />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            </>
          ) : (

            /* ================= SECTION B: GUEST SUB-LOGIN MODE ================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 800 }}>
                  Portal Sub-Login
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Select your destination portal and sub-class role to access your dashboard.
                </p>
              </div>

              {/* Portal Tabs: Merchant vs Admin */}
              <div style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '0.25rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setLoginTab('merchant');
                    setSelectedSubRole('Merchant Consignor / Shipper');
                    setLoginError('');
                  }}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.85rem',
                    border: 'none',
                    borderRadius: '6px',
                    background: loginTab === 'merchant' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                    color: loginTab === 'merchant' ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: loginTab === 'merchant' ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Building size={15} color={loginTab === 'merchant' ? 'var(--brand-cyan)' : 'currentColor'} />
                  <span>Merchant Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginTab('admin');
                    setSelectedSubRole('Command HQ / Super Admin');
                    setLoginError('');
                  }}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.85rem',
                    border: 'none',
                    borderRadius: '6px',
                    background: loginTab === 'admin' ? 'rgba(255, 102, 0, 0.2)' : 'transparent',
                    color: loginTab === 'admin' ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: loginTab === 'admin' ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <ShieldCheck size={15} color={loginTab === 'admin' ? 'var(--brand-orange)' : 'currentColor'} />
                  <span>Admin Tower</span>
                </button>
              </div>

              {/* Sub-Class Role Options for Selected Portal */}
              <div>
                <label className="input-label" style={{ fontSize: '0.78rem', marginBottom: '0.45rem' }}>
                  Select Sub-Class Role:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {(loginTab === 'admin' ? ADMIN_SUB_ROLES : MERCHANT_SUB_ROLES).map((role) => {
                    const isSelected = selectedSubRole === role.id;
                    const IconComp = role.icon;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedSubRole(role.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.6rem 0.85rem',
                          background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                          border: isSelected ? `1px solid ${role.badgeColor}` : '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{
                          color: role.badgeColor,
                          background: role.badgeBg,
                          padding: '0.35rem',
                          borderRadius: '6px',
                          display: 'flex'
                        }}>
                          <IconComp size={14} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                            {role.label}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {role.desc}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 size={15} color={role.badgeColor} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sub-Login Form */}
              <form onSubmit={handleSubLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {loginError && (
                  <div style={{
                    padding: '0.65rem 0.85rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#f87171',
                    fontSize: '0.8rem'
                  }}>
                    {loginError}
                  </div>
                )}

                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label" style={{ fontSize: '0.78rem' }}>
                    {loginTab === 'admin' ? 'Command HQ Admin Email *' : 'Merchant Registered Email *'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={loginTab === 'admin' ? 'soben@double11.com' : 'merchant@domain.com'}
                      className="input-field"
                      style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label" style={{ fontSize: '0.78rem' }}>
                    Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-field"
                      style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '0.4rem',
                    background: loginTab === 'admin'
                      ? 'linear-gradient(135deg, #ff6600 0%, #b33900 100%)'
                      : 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)'
                  }}
                >
                  {loginLoading ? <RefreshCw size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                  <span>{loginTab === 'admin' ? 'Enter Admin Control Tower' : 'Login to Merchant Portal'}</span>
                </button>
              </form>

              {/* Quick Links for Visitors */}
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  QUICK NAVIGATION:
                </div>
                <Link
                  href="/bookings"
                  onClick={onClose}
                  style={{ fontSize: '0.82rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                >
                  <Boxes size={14} color="var(--brand-orange)" />
                  <span>All Bookings Data Registry</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  style={{ fontSize: '0.82rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                >
                  <Cpu size={14} color="var(--brand-cyan)" />
                  <span>Operations &amp; Fleet Dashboard</span>
                </Link>
                <Link
                  href="/book"
                  onClick={onClose}
                  style={{ fontSize: '0.82rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                >
                  <Truck size={14} color="var(--brand-emerald)" />
                  <span>Book Domestic Consignment</span>
                </Link>
                <Link
                  href="/login"
                  onClick={onClose}
                  style={{ fontSize: '0.82rem', color: 'var(--brand-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                >
                  <span>Need a new merchant account? Register here &rarr;</span>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

      <style jsx global>{`
        .profile-portal-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0.9rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .profile-portal-link:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateX(3px);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
