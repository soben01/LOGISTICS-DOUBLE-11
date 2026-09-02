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
  KeyRound
} from 'lucide-react';
import { getCurrentUser, loginUser, signupUser, User } from '../../lib/auth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/book';

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Sign In fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Sign Up fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCompany, setSignupCompany] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Status message
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // If already logged in, redirect
    const user = getCurrentUser();
    if (user) {
      router.push(redirectPath);
    }
  }, [redirectPath, router]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = loginUser(loginEmail, loginPassword);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to authenticate.');
    } else {
      setSuccessMsg(`Welcome back, ${res.user?.name}! Redirecting...`);
      setTimeout(() => {
        router.push(redirectPath);
      }, 800);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
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
    } else {
      setSuccessMsg(`Account created successfully for ${res.user?.name}! You can now book cargo.`);
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    }
  };

  const handleDemoLogin = (email: string) => {
    setLoginEmail(email);
    const res = loginUser(email);
    if (res.success) {
      setSuccessMsg(`Logged in as ${res.user?.name}. Redirecting...`);
      setTimeout(() => {
        router.push(redirectPath);
      }, 600);
    }
  };

  return (
    <div style={{ padding: '4rem 0 6rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ff6600 0%, #b33900 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 4px 18px rgba(255, 102, 0, 0.4)'
          }}>
            <Lock size={24} color="#ffffff" />
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>
            Merchant Security Access
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Sign in or create a verified Double 11 logistics profile to book consignments and access dispatch waybills.
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel" style={{ padding: '2rem 2.25rem' }}>
          {/* Tab Switcher */}
          <div className="tab-list" style={{ marginBottom: '1.75rem' }}>
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            >
              Merchant Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
              className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            >
              Create Account (Sign Up)
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              color: '#34d399',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem'
            }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">Business Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    placeholder="merchant@company.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="input-label">Password</label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--brand-orange)', cursor: 'pointer' }}>
                    Demo Mode (any password)
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem', width: '100%' }}>
                <span>Authorize & Sign In</span>
                <ArrowRight size={16} />
              </button>

              {/* 1-Click Demo Accounts */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.6rem', textAlign: 'center' }}>
                  QUICK 1-CLICK DEMO AUTHENTICATION:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('soben@double11.com')}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: '0.78rem' }}
                  >
                    Soben (Founder)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('elena@pacificrobotics.com')}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: '0.78rem' }}
                  >
                    Elena (Merchant)
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP FORM */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="input-group">
                <label className="input-label">Full Name / Primary Contact</label>
                <input
                  type="text"
                  placeholder="e.g. Marcus Chen"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Business / Merchant Name</label>
                <div style={{ position: 'relative' }}>
                  <Building size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="e.g. Shenzhen Vanguard Trading Co."
                    value={signupCompany}
                    onChange={(e) => setSignupCompany(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Business Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Contact Phone</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    placeholder="+1 800 000 0000"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Choose Password</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem', width: '100%' }}>
                <span>Register &amp; Unlock Cargo Booking</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Security Assurance */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={15} color="var(--brand-emerald)" />
          <span>IATA Verified Cargo Security &middot; AES-256 Waybill Encryption</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading authentication portal...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
