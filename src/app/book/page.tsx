'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Plane,
  Ship,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Printer,
  Boxes,
  Sparkles,
  Lock,
  UserCheck,
  AlertCircle,
  Building,
  Mail,
  Phone,
  KeyRound,
  LogOut,
  Clock,
  Globe2
} from 'lucide-react';
import { createShipment, Shipment } from '../../lib/store';
import { getCurrentUser, loginUser, signupUser, logoutUser, User } from '../../lib/auth';

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialService = (searchParams.get('service') as Shipment['serviceCode']) || 'EXP';
  const initialOrigin = searchParams.get('origin') || 'HKG';
  const initialDest = searchParams.get('dest') || 'USA';
  const initialWt = parseFloat(searchParams.get('wt') || '5');

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('password123');
  const [authName, setAuthName] = useState('');
  const [authCompany, setAuthCompany] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Wizard Step
  const [step, setStep] = useState(1);

  // Form State
  const [senderName, setSenderName] = useState('');
  const [senderCompany, setSenderCompany] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [originCity, setOriginCity] = useState(initialOrigin === 'HKG' ? 'Hong Kong' : initialOrigin === 'CHN' ? 'Shenzhen' : 'Singapore');
  const [originCountry, setOriginCountry] = useState(initialOrigin);

  const [recipientName, setRecipientName] = useState('Alexander Vance');
  const [recipientCompany, setRecipientCompany] = useState('Vance Logistics Corp');
  const [recipientAddress, setRecipientAddress] = useState('742 Evergreen Terrace, Suite 100');
  const [recipientCity, setRecipientCity] = useState('Los Angeles');
  const [recipientCountry, setRecipientCountry] = useState(initialDest);
  const [recipientPostal, setRecipientPostal] = useState('90001');
  const [recipientPhone, setRecipientPhone] = useState('+1 310 555 9812');

  const [cargoDesc, setCargoDesc] = useState('High-Density Server Circuitry & Sensors');
  const [pieces, setPieces] = useState<number>(2);
  const [weightKg, setWeightKg] = useState<number>(initialWt || 5);
  const [lengthCm, setLengthCm] = useState<number>(40);
  const [widthCm, setWidthCm] = useState<number>(30);
  const [heightCm, setHeightCm] = useState<number>(25);
  const [declaredValue, setDeclaredValue] = useState<number>(4500);

  const [selectedService, setSelectedService] = useState<Shipment['serviceCode']>(initialService);
  const [addInsurance, setAddInsurance] = useState(true);
  const [addCarbonOffset, setAddCarbonOffset] = useState(true);

  // Created Shipment confirmation state
  const [createdShipment, setCreatedShipment] = useState<Shipment | null>(null);

  // Load and sync user auth state
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setSenderName(user.name);
      setSenderCompany(user.company);
      setSenderPhone(user.phone);
    }

    const handleAuthChange = () => {
      const u = getCurrentUser();
      setCurrentUser(u);
      if (u) {
        setSenderName(u.name);
        setSenderCompany(u.company);
        setSenderPhone(u.phone);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const res = loginUser(authEmail, authPassword);
    if (!res.success) {
      setAuthError(res.error || 'Authentication failed.');
    } else if (res.user) {
      setCurrentUser(res.user);
      setSenderName(res.user.name);
      setSenderCompany(res.user.company);
      setSenderPhone(res.user.phone);
      setAuthSuccess(`Welcome, ${res.user.name}! Access granted.`);
    }
  };

  const handleInlineSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const res = signupUser({
      name: authName,
      email: authEmail,
      company: authCompany,
      phone: authPhone,
      password: authPassword,
    });

    if (!res.success) {
      setAuthError(res.error || 'Failed to create merchant account.');
    } else if (res.user) {
      setCurrentUser(res.user);
      setSenderName(res.user.name);
      setSenderCompany(res.user.company);
      setSenderPhone(res.user.phone);
      setAuthSuccess(`Account created for ${res.user.name}! Booking unlocked.`);
    }
  };

  const handleDemoSignIn = (email: string) => {
    const res = loginUser(email);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setSenderName(res.user.name);
      setSenderCompany(res.user.company);
      setSenderPhone(res.user.phone);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleFinishBooking = () => {
    let serviceName: Shipment['service'] = 'Double 11 Nepal Express';
    if (selectedService === 'CARGO') serviceName = 'Nationwide Hub Cargo';
    else if (selectedService === 'RUSH') serviceName = 'Same-Day Valley Rush';
    else if (selectedService === 'INTL') serviceName = 'International Cross-Border (Coming Soon)';

    const shipment = createShipment({
      service: serviceName,
      serviceCode: selectedService,
      origin: {
        city: originCity,
        province: 'Bagmati Province',
        hub: `${originCity} Central Hub`,
      },
      destination: {
        city: recipientCity,
        province: 'Nepal',
        hub: `${recipientCity} Regional Hub`,
        areaCode: recipientPostal,
      },
      sender: {
        name: senderName || currentUser?.name || 'Verified Merchant',
        company: senderCompany || currentUser?.company || 'Nepal Merchant Pvt Ltd',
        phone: senderPhone || currentUser?.phone || '+977 98000 00000',
      },
      recipient: {
        name: recipientName,
        company: recipientCompany,
        address: recipientAddress,
        phone: recipientPhone,
      },
      cargo: {
        pieces: Number(pieces),
        weightKg: Number(weightKg),
        volumeCbm: (lengthCm * widthCm * heightCm) / 1000000,
        description: cargoDesc,
        declaredValueNpr: Number(declaredValue),
      },
    });

    setCreatedShipment(shipment);
    setStep(5);
  };

  const getStepProgress = () => {
    return ((step - 1) / 4) * 100;
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem 0' }}>
      <div className="container-narrow">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-orange" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={13} /> Instant Dispatch
          </div>
          <h1>Book a Consignment</h1>
          <p style={{ maxWidth: '560px', margin: '0.5rem auto 0 auto' }}>
            Seamless door-to-door booking with instant airway bill issuance, automated customs declaration, and immediate tracking synchronization.
          </p>
        </div>

        {/* ================= AUTH GATE: REQUIRED TO ADD SHIPMENT ================= */}
        {!currentUser ? (
          <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'rgba(255, 102, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: 'var(--brand-orange)',
              border: '1px solid rgba(255, 102, 0, 0.3)',
              boxShadow: '0 0 20px rgba(255, 102, 0, 0.25)'
            }}>
              <Lock size={26} />
            </div>

            <div className="badge badge-orange" style={{ marginBottom: '0.75rem' }}>
              IATA Security Compliance
            </div>

            <h2 style={{ fontSize: '1.65rem', marginBottom: '0.5rem' }}>
              Merchant Authentication Required
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: '1.6' }}>
              To comply with international civil aviation security and automated customs pre-clearance, <strong>only registered Double 11 merchants can book and dispatch consignments</strong>. Please sign in or create an account to proceed.
            </p>

            {/* Switchable Inline Auth Tabs */}
            <div className="tab-list" style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => { setAuthTab('signin'); setAuthError(''); }}
                className={`tab-btn ${authTab === 'signin' ? 'active' : ''}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('signup'); setAuthError(''); }}
                className={`tab-btn ${authTab === 'signup' ? 'active' : ''}`}
              >
                Sign Up (Register)
              </button>
            </div>

            {/* Error / Success Feedback */}
            {authError && (
              <div style={{
                padding: '0.75rem',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                borderRadius: '8px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
                textAlign: 'left'
              }}>
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div style={{
                padding: '0.75rem',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                borderRadius: '8px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}>
                <CheckCircle2 size={16} />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* INLINE SIGN IN FORM */}
            {authTab === 'signin' && (
              <form onSubmit={handleInlineLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                <div className="input-group">
                  <label className="input-label">Merchant Business Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      placeholder="merchant@company.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
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
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem', width: '100%' }}>
                  <span>Sign In &amp; Unlock Booking</span>
                  <ArrowRight size={16} />
                </button>

                {/* 1-Click Quick Demo Sign In */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                    OR INSTANT 1-CLICK DEMO AUTH:
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleDemoSignIn('soben@double11.com')}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontSize: '0.78rem' }}
                    >
                      Soben (Founder)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoSignIn('elena@pacificrobotics.com')}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontSize: '0.78rem' }}
                    >
                      Elena (Merchant)
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* INLINE SIGN UP FORM */}
            {authTab === 'signup' && (
              <form onSubmit={handleInlineSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                <div className="input-group">
                  <label className="input-label">Your Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Marcus Chen"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Company / Merchant Brand</label>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="e.g. Vanguard Trading Global"
                      value={authCompany}
                      onChange={(e) => setAuthCompany(e.target.value)}
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
                      placeholder="marcus@vanguard.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      placeholder="+1 800 555 0199"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Create Password</label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem', width: '100%' }}>
                  <span>Create Account &amp; Unlock Booking</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ================= AUTHENTICATED: BOOKING WIZARD ================= */
          <div>
            {/* Logged in merchant banner */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <UserCheck size={18} color="var(--brand-emerald)" />
                <span style={{ fontSize: '0.9rem', color: '#ffffff' }}>
                  Authenticated Merchant: <strong>{currentUser.name}</strong> ({currentUser.company})
                </span>
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                  Verified Consignor
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
              >
                <LogOut size={13} />
                <span>Switch Account</span>
              </button>
            </div>

            {/* Step Progress Bar */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: step >= 1 ? 'var(--brand-orange)' : undefined }}>1. Sender Info</span>
                <span style={{ color: step >= 2 ? 'var(--brand-orange)' : undefined }}>2. Recipient</span>
                <span style={{ color: step >= 3 ? 'var(--brand-orange)' : undefined }}>3. Cargo Spec</span>
                <span style={{ color: step >= 4 ? 'var(--brand-orange)' : undefined }}>4. Service Tier</span>
                <span style={{ color: step >= 5 ? 'var(--brand-emerald)' : undefined }}>5. Waybill Confirmation</span>
              </div>

              <div style={{ height: '6px', background: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${getStepProgress()}%`,
                  background: 'linear-gradient(90deg, #ff6600, #ff944d)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Wizard Form Card */}
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              {/* STEP 1: Sender */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={20} color="var(--brand-orange)" />
                    <span>Step 1: Shipper & Origin Gateway</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group">
                      <label className="input-label">Shipper / Contact Name</label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Company Name</label>
                      <input
                        type="text"
                        value={senderCompany}
                        onChange={(e) => setSenderCompany(e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Contact Phone Number</label>
                      <input
                        type="text"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Origin Hub (Nepal)</label>
                      <select
                        value={originCity}
                        onChange={(e) => setOriginCity(e.target.value)}
                        className="select-field"
                      >
                        <option value="Kathmandu">Kathmandu (Central Hub - TIA Gate)</option>
                        <option value="Lalitpur">Lalitpur (Patan Mega-Hub)</option>
                        <option value="Bhaktapur">Bhaktapur (East Valley Hub)</option>
                        <option value="Pokhara">Pokhara (Gandaki Regional Hub)</option>
                        <option value="Birgunj">Birgunj (Dry Port Trade Terminal)</option>
                        <option value="Biratnagar">Biratnagar (Koshi Province Hub)</option>
                        <option value="Chitwan">Chitwan (Bharatpur / Narayangarh)</option>
                        <option value="Butwal">Butwal (Lumbini Trade Corridor)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setStep(2)} className="btn btn-primary">
                      <span>Continue to Recipient</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Recipient */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={20} color="var(--brand-orange)" />
                    <span>Step 2: Consignee &amp; Delivery Destination</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group">
                      <label className="input-label">Recipient Full Name</label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Company / Shop Name (Optional)</label>
                      <input
                        type="text"
                        value={recipientCompany}
                        onChange={(e) => setRecipientCompany(e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                      <label className="input-label">Street / Area Address (Doorstep Delivery)</label>
                      <input
                        type="text"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        className="input-field"
                        placeholder="e.g. Lakeside Ward 6, New Road, Lions Chowk"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Destination City / Region (Nepal)</label>
                      <select
                        value={recipientCity}
                        onChange={(e) => setRecipientCity(e.target.value)}
                        className="select-field"
                      >
                        <option value="Pokhara">Pokhara (Gandaki Province)</option>
                        <option value="Kathmandu">Kathmandu Valley</option>
                        <option value="Lalitpur">Lalitpur (Patan)</option>
                        <option value="Bhaktapur">Bhaktapur</option>
                        <option value="Biratnagar">Biratnagar (Koshi Province)</option>
                        <option value="Birgunj">Birgunj (Madhesh Province)</option>
                        <option value="Chitwan">Chitwan (Bharatpur / Narayangarh)</option>
                        <option value="Butwal">Butwal / Bhairahawa</option>
                        <option value="Dharan">Dharan / Itahari</option>
                        <option value="Nepalgunj">Nepalgunj (Banke)</option>
                        <option value="Dhangadhi">Dhangadhi (Far-West)</option>
                        <option value="Rest of Nepal">Rest of Nepal (77 Districts)</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Postal Code / Landmark</label>
                      <input
                        type="text"
                        value={recipientPostal}
                        onChange={(e) => setRecipientPostal(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Recipient Phone</label>
                      <input
                        type="text"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>
                    <button type="button" onClick={() => setStep(3)} className="btn btn-primary">
                      <span>Continue to Cargo Spec</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Cargo Spec */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Boxes size={20} color="var(--brand-orange)" />
                    <span>Step 3: Cargo Specifications</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                      <label className="input-label">Commodity Description</label>
                      <input
                        type="text"
                        value={cargoDesc}
                        onChange={(e) => setCargoDesc(e.target.value)}
                        className="input-field"
                        placeholder="e.g. Consumer Electronics, Fabric Textiles, Auto Parts"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Number of Pieces (Colli)</label>
                      <input
                        type="number"
                        min="1"
                        value={pieces}
                        onChange={(e) => setPieces(parseInt(e.target.value) || 1)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Total Weight (KG)</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        value={weightKg}
                        onChange={(e) => setWeightKg(parseFloat(e.target.value) || 1)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                      <label className="input-label">Package Dimensions (L &times; W &times; H cm)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                        <input
                          type="number"
                          placeholder="Length cm"
                          value={lengthCm}
                          onChange={(e) => setLengthCm(parseInt(e.target.value) || 1)}
                          className="input-field"
                        />
                        <input
                          type="number"
                          placeholder="Width cm"
                          value={widthCm}
                          onChange={(e) => setWidthCm(parseInt(e.target.value) || 1)}
                          className="input-field"
                        />
                        <input
                          type="number"
                          placeholder="Height cm"
                          value={heightCm}
                          onChange={(e) => setHeightCm(parseInt(e.target.value) || 1)}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Declared Customs Value ($ USD)</label>
                      <input
                        type="number"
                        value={declaredValue}
                        onChange={(e) => setDeclaredValue(parseFloat(e.target.value) || 0)}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setStep(2)} className="btn btn-secondary">
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>
                    <button type="button" onClick={() => setStep(4)} className="btn btn-primary">
                      <span>Choose Service Tier</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Service Tier Selection */}
              {step === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plane size={20} color="var(--brand-orange)" />
                    <span>Step 4: Select Domestic Service Tier &amp; Protection</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Option 1: Nepal Express */}
                    <div
                      onClick={() => setSelectedService('EXP')}
                      className="card"
                      style={{
                        cursor: 'pointer',
                        border: selectedService === 'EXP' ? '2px solid var(--brand-orange)' : undefined,
                        background: selectedService === 'EXP' ? 'rgba(255, 102, 0, 0.06)' : undefined
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-orange)', fontWeight: 700 }}>
                          <Truck size={18} />
                          <span>Double 11 Nepal Express</span>
                        </div>
                        <span className="badge badge-orange">Fastest</span>
                      </div>
                      <p style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                        24h guaranteed intercity linehaul with electric express vans &amp; live GPS rider tracking.
                      </p>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                        Est. Rs. {Math.round(220 + (weightKg - 1) * 60)} NPR
                      </div>
                    </div>

                    {/* Option 2: Nationwide Cargo */}
                    <div
                      onClick={() => setSelectedService('CARGO')}
                      className="card"
                      style={{
                        cursor: 'pointer',
                        border: selectedService === 'CARGO' ? '2px solid var(--brand-orange)' : undefined,
                        background: selectedService === 'CARGO' ? 'rgba(255, 102, 0, 0.06)' : undefined
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-cyan)', fontWeight: 700 }}>
                          <Boxes size={18} />
                          <span>Nationwide Hub Cargo</span>
                        </div>
                        <span className="badge badge-cyan">All 77 Districts</span>
                      </div>
                      <p style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                        Bulk freight and consolidated distribution across all 7 provinces (2-3 days).
                      </p>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                        Est. Rs. {Math.round(160 + weightKg * 40)} NPR
                      </div>
                    </div>

                    {/* Option 3: Valley Rush */}
                    <div
                      onClick={() => setSelectedService('RUSH')}
                      className="card"
                      style={{
                        cursor: 'pointer',
                        border: selectedService === 'RUSH' ? '2px solid var(--brand-orange)' : undefined,
                        background: selectedService === 'RUSH' ? 'rgba(255, 102, 0, 0.06)' : undefined
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-emerald)', fontWeight: 700 }}>
                          <Clock size={18} />
                          <span>Same-Day Valley Rush</span>
                        </div>
                        <span className="badge badge-emerald">Under 3h</span>
                      </div>
                      <p style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                        Direct dedicated rider for Kathmandu, Lalitpur &amp; Bhaktapur urgent deliveries.
                      </p>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                        Est. Rs. {Math.round(290 + (weightKg - 1) * 50)} NPR
                      </div>
                    </div>

                    {/* Option 4: International Air Freight (COMING SOON) */}
                    <div
                      onClick={() => {
                        alert('International Cross-Border Cargo is currently in pilot phase and launching Q4 2026. Please select a domestic tier for immediate dispatch.');
                      }}
                      className="card"
                      style={{
                        cursor: 'pointer',
                        border: '1px dashed rgba(245, 158, 11, 0.4)',
                        background: 'rgba(245, 158, 11, 0.04)',
                        position: 'relative'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '12px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: '#000',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px'
                      }}>
                        COMING SOON
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-amber)', fontWeight: 700 }}>
                          <Globe2 size={18} />
                          <span>International Air Freight</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                        TIA (Kathmandu) direct air cargo flights to Dubai, India &amp; China. Launching Q4 2026.
                      </p>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-amber)' }}>
                        Pilot Phase &bull; Launching Q4 2026
                      </div>
                    </div>
                  </div>

                  {/* Value Add Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input
                        type="checkbox"
                        checked={addInsurance}
                        onChange={(e) => setAddInsurance(e.target.checked)}
                        style={{ accentColor: 'var(--brand-orange)' }}
                      />
                      <span>Include All-Risk Cargo Insurance (Covers up to $10,000 USD) &mdash; <strong>+$15.00</strong></span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input
                        type="checkbox"
                        checked={addCarbonOffset}
                        onChange={(e) => setAddCarbonOffset(e.target.checked)}
                        style={{ accentColor: 'var(--brand-emerald)' }}
                      />
                      <span>100% Certified Sustainable Aviation Fuel (SAF) Carbon Offset &mdash; <strong>+$4.50</strong></span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setStep(3)} className="btn btn-secondary">
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>
                    <button type="button" onClick={handleFinishBooking} className="btn btn-primary btn-lg">
                      <span>Confirm & Issue Waybill</span>
                      <CheckCircle2 size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Waybill Confirmation */}
              {step === 5 && createdShipment && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem auto',
                      color: 'var(--brand-emerald)'
                    }}>
                      <CheckCircle2 size={32} />
                    </div>
                    <h2>Booking Confirmed & Dispatched!</h2>
                    <p style={{ marginTop: '0.25rem' }}>
                      Your consignment has been authorized by <strong>{currentUser.name}</strong> and queued for departure.
                    </p>
                  </div>

                  {/* Printable Official Waybill Card */}
                  <div style={{
                    background: '#ffffff',
                    color: '#070a12',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    position: 'relative'
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #111', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ea580c' }}>
                          DOUBLE 11 LOGISTICS &middot; DOMESTIC WAYBILL
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                          Nepal Express Priority &middot; Nationwide Linehaul &middot; Dispatch Node #NP-11
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>CONSIGNMENT #</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                          {createdShipment.id}
                        </div>
                      </div>
                    </div>

                    {/* Shipper & Consignee Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.25rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#6b7280', fontSize: '0.75rem' }}>SHIPPER (FROM):</div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{createdShipment.sender.name}</div>
                        <div>{createdShipment.sender.company}</div>
                        <div>Origin Hub: {createdShipment.origin.hub}</div>
                        <div>Phone: {createdShipment.sender.phone}</div>
                      </div>

                      <div>
                        <div style={{ fontWeight: 700, color: '#6b7280', fontSize: '0.75rem' }}>CONSIGNEE (TO):</div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{createdShipment.recipient.name}</div>
                        <div>{createdShipment.recipient.company}</div>
                        <div>{createdShipment.recipient.address}</div>
                        <div>{createdShipment.destination.city}, Nepal &middot; {createdShipment.destination.areaCode}</div>
                      </div>
                    </div>

                    {/* Cargo Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.25rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                      <div>
                        <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>PIECES</div>
                        <div style={{ fontWeight: 700 }}>{createdShipment.cargo.pieces} PKGS</div>
                      </div>
                      <div>
                        <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>GROSS WEIGHT</div>
                        <div style={{ fontWeight: 700 }}>{createdShipment.cargo.weightKg} KG</div>
                      </div>
                      <div>
                        <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>SERVICE TIER</div>
                        <div style={{ fontWeight: 700 }}>{createdShipment.service}</div>
                      </div>
                      <div>
                        <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>DECLARED VALUE</div>
                        <div style={{ fontWeight: 700 }}>Rs. {createdShipment.cargo.declaredValueNpr} NPR</div>
                      </div>
                    </div>

                    {/* Barcode & Signature Graphic */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', letterSpacing: '4px', fontWeight: 800 }}>
                          ||||| | |||| ||| |||||| || |||
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
                          {createdShipment.telemetry.waybillNumber || createdShipment.telemetry.airwayBill}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          padding: '0.35rem 0.65rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <CheckCircle2 size={13} /> CUSTOMS PRE-CLEARED
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link href={`/track?id=${createdShipment.id}`} className="btn btn-primary btn-lg">
                      <span>Track This Package Live</span>
                      <ArrowRight size={16} />
                    </Link>

                    <Link href="/operations" className="btn btn-secondary btn-lg">
                      <span>View in Control Tower</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined') window.print();
                      }}
                      className="btn btn-outline btn-lg"
                    >
                      <Printer size={16} />
                      <span>Print Label</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading booking wizard...
      </div>
    }>
      <BookContent />
    </Suspense>
  );
}
