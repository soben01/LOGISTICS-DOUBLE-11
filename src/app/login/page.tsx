'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  UserCheck,
  Mail,
  Building,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  ShieldAlert,
  Truck,
  Users
} from 'lucide-react';
import { getCurrentUser, loginUser, signupUser, User } from '../../lib/auth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  // Top role mode: 'merchant' or 'admin'
  const [roleMode, setRoleMode] = useState<'merchant' | 'admin'>('merchant');

  // Sub-tabs for merchant
  const [merchantTab, setMerchantTab] = useState<'signin' | 'signup'>('signin');

  // Sign In fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');

  // Sign Up fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCompany, setSignupCompany] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('password123');

  // Status messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      if (redirectPath) {
        router.push(redirectPath);
      } else if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/merchant');
      }
    }
  }, [redirectPath, router]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = loginUser(email, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
    } else if (res.user) {
      const destination = redirectPath || (res.user.role === 'admin' ? '/admin' : '/merchant');
      setSuccessMsg(`Welcome back, ${res.user.name} (${res.user.role.toUpperCase()})! Opening console...`);
      setTimeout(() => {
        router.push(destination);
      }, 700);
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = signupUser({
      name: signupName,
      email: signupEmail,
      company: signupCompany,
      phone: signupPhone,
      password: signupPassword,
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create merchant account.');
    } else if (res.user) {
      setSuccessMsg(`Merchant account registered for ${res.user.name}! Access granted.`);
      setTimeout(() => {
        router.push(redirectPath || '/merchant');
      }, 900);
    }
  };

  const handle1ClickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    const res = loginUser(demoEmail);
    if (res.success && res.user) {
      const target = redirectPath || (res.user.role === 'admin' ? '/admin' : '/merchant');
      setSuccessMsg(`Signed in as ${res.user.name} [${res.user.role.toUpperCase()}]. Redirecting...`);
      setTimeout(() => {
        router.push(target);
      }, 600);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem 0' }}>
      <div className="container-narrow">
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-orange" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={13} /> DOUBLE 11 AUTHENTICATION
          </div>
          <h1 style={{ fontSize: '2.4rem' }}>Unified Portal Access</h1>
          <p style={{ maxWidth: '520px', margin: '0.5rem auto 0 auto', color: 'var(--text-secondary)' }}>
            Choose whether you are signing in as a verified Nepal Merchant or entering the Central Admin Control Tower.
          </p>
        </div>

        {/* Role Selector Tabs (Merchant vs Admin) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          maxWidth: '560px',
          margin: '0 auto 2rem auto',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '0.5rem',
          borderRadius: '14px',
          border: '1px solid var(--border-medium)'
        }}>
          <button
            type="button"
            onClick={() => {
              setRoleMode('merchant');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              border: roleMode === 'merchant' ? '1px solid var(--brand-cyan)' : '1px solid transparent',
              background: roleMode === 'merchant' ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
              color: roleMode === 'merchant' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Truck size={18} color={roleMode === 'merchant' ? 'var(--brand-cyan)' : undefined} />
            <span>Merchant Portal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleMode('admin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              border: roleMode === 'admin' ? '1px solid var(--brand-orange)' : '1px solid transparent',
              background: roleMode === 'admin' ? 'rgba(255, 102, 0, 0.12)' : 'transparent',
              color: roleMode === 'admin' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <ShieldCheck size={18} color={roleMode === 'admin' ? 'var(--brand-orange)' : undefined} />
            <span>Admin Console</span>
          </button>
        </div>

        {/* Main Form Glass Panel */}
        <div className="glass-panel" style={{ maxWidth: '560px', margin: '0 auto', padding: '2.5rem' }}>
          {/* Feedback alerts */}
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={17} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={17} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= MODE 1: MERCHANT PORTAL ================= */}
          {roleMode === 'merchant' && (
            <div>
              {/* Sub-tabs: Sign In vs Sign Up */}
              <div className="tab-list" style={{ marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setMerchantTab('signin'); setErrorMsg(''); }}
                  className={`tab-btn ${merchantTab === 'signin' ? 'active' : ''}`}
                >
                  Merchant Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMerchantTab('signup'); setErrorMsg(''); }}
                  className={`tab-btn ${merchantTab === 'signup' ? 'active' : ''}`}
                >
                  Create Merchant Account
                </button>
              </div>

              {merchantTab === 'signin' ? (
                <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="input-group">
                    <label className="input-label">Merchant Business Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. pradeep@himalayantech.np"
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <div style={{ position: 'relative' }}>
                      <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
                    <span>Enter Merchant Portal</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Company / Shop Name</label>
                    <div style={{ position: 'relative' }}>
                      <Building size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        value={signupCompany}
                        onChange={(e) => setSignupCompany(e.target.value)}
                        placeholder="e.g. Pokhara Electronics Hub"
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Authorized Representative Full Name</label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Pradeep Gurung"
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Business Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="pradeep@business.np"
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Nepal Mobile Number (SMS Telemetry)</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="tel"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        placeholder="+977 98000 00000"
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
                    <span>Register Merchant &amp; Get COD Ready</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ================= MODE 2: ADMIN CONSOLE ================= */}
          {roleMode === 'admin' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(255, 102, 0, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  color: 'var(--brand-orange)'
                }}>
                  <ShieldCheck size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem' }}>Central Control Tower Login</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Administrative access for Founder Soben and regional dispatch supervisors.
                </p>
              </div>

              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="input-label">Administrator Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="soben@double11.com"
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Master Passkey</label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
                  <ShieldCheck size={18} />
                  <span>Authenticate &amp; Open Control Tower</span>
                </button>
              </form>
            </div>
          )}

          {/* Quick 1-Click Demo Accounts */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.75rem', textAlign: 'center' }}>
              FAST 1-CLICK DEMO ACCESS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {/* Admin 1-Click */}
              <button
                type="button"
                onClick={() => handle1ClickDemo('soben@double11.com')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 102, 0, 0.08)',
                  border: '1px solid rgba(255, 102, 0, 0.3)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ShieldCheck size={16} color="var(--brand-orange)" />
                  <div>
                    <strong style={{ color: 'var(--brand-orange)' }}>Admin Console: Soben</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>soben@double11.com &bull; Master Control Tower</div>
                  </div>
                </div>
                <span className="badge badge-orange" style={{ fontSize: '0.68rem' }}>Admin Role</span>
              </button>

              {/* Merchant 1-Click */}
              <button
                type="button"
                onClick={() => handle1ClickDemo('pradeep@himalayantech.np')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Building size={16} color="var(--brand-cyan)" />
                  <div>
                    <strong style={{ color: 'var(--brand-cyan)' }}>Merchant: Pradeep Gurung</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Himalayan Tech Nepal Pvt Ltd &bull; COD Portal</div>
                  </div>
                </div>
                <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>Merchant Role</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: '6rem 0', textAlign: 'center' }}>Loading authentication portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
