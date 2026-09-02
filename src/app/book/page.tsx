'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Plane,
  Truck,
  Boxes,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Printer,
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
  Globe2,
  MapPin,
  Banknote,
  Navigation,
  Info,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { createShipment, Shipment } from '../../lib/store';
import { getCurrentUser, loginUser, signupUser, logoutUser, User } from '../../lib/auth';
import PrintableLabel from '../../components/shipping/PrintableLabel';

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialService = (searchParams.get('service') as Shipment['serviceCode']) || 'EXP';
  const initialOrigin = searchParams.get('origin') || 'Kathmandu';
  const initialDest = searchParams.get('dest') || 'Pokhara';
  const initialWt = parseFloat(searchParams.get('wt') || '3.5');

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

  // Wizard Step (1 to 5)
  const [step, setStep] = useState(1);

  // Form State - Sender (Shipper)
  const [senderName, setSenderName] = useState('');
  const [senderCompany, setSenderCompany] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [originCity, setOriginCity] = useState(initialOrigin);

  // Form State - Recipient (Consignee)
  const [recipientName, setRecipientName] = useState('Pradeep Gurung');
  const [recipientCompany, setRecipientCompany] = useState('Annapurna IT Solutions');
  const [recipientAddress, setRecipientAddress] = useState('Lakeside Ward No. 6, Near Barahi Chowk');
  const [recipientCity, setRecipientCity] = useState(initialDest);
  const [recipientPostal, setRecipientPostal] = useState('33700');
  const [recipientPhone, setRecipientPhone] = useState('+977 98460 11223');

  // Form State - Cargo Specifications
  const [cargoDesc, setCargoDesc] = useState('Consumer Electronics & Apparel Order');
  const [pieces, setPieces] = useState<number>(1);
  const [weightKg, setWeightKg] = useState<number>(initialWt || 3.5);
  const [lengthCm, setLengthCm] = useState<number>(30);
  const [widthCm, setWidthCm] = useState<number>(20);
  const [heightCm, setHeightCm] = useState<number>(15);
  const [declaredValueNpr, setDeclaredValueNpr] = useState<number>(8500);

  // Cash on Delivery (COD)
  const [isCod, setIsCod] = useState<boolean>(true);
  const [codAmountNpr, setCodAmountNpr] = useState<number>(3200);

  // Service Tier & Options
  const [selectedService, setSelectedService] = useState<Shipment['serviceCode']>(initialService);
  const [addInsurance, setAddInsurance] = useState<boolean>(true);
  const [addCarbonOffset, setAddCarbonOffset] = useState<boolean>(false);

  // Created Shipment confirmation state
  const [createdShipment, setCreatedShipment] = useState<Shipment | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Load and sync user auth state: STRICTLY REQUIRE LOGIN FOR BOOKING
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login?redirect=/book');
      return;
    }
    setCurrentUser(user);
    setSenderName(user.name);
    setSenderCompany(user.company);
    setSenderPhone(user.phone);

    const handleAuthChange = () => {
      const u = getCurrentUser();
      if (!u) {
        router.push('/login?redirect=/book');
        return;
      }
      setCurrentUser(u);
      setSenderName(u.name);
      setSenderCompany(u.company);
      setSenderPhone(u.phone);
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [router]);

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

  // Quick Preset Handlers
  const applyPreset = (desc: string, wt: number, l: number, w: number, h: number, val: number) => {
    setCargoDesc(desc);
    setWeightKg(wt);
    setLengthCm(l);
    setWidthCm(w);
    setHeightCm(h);
    setDeclaredValueNpr(val);
  };

  // Pre-fill sender profile
  const handleUseMyProfile = () => {
    if (currentUser) {
      setSenderName(currentUser.name);
      setSenderCompany(currentUser.company);
      setSenderPhone(currentUser.phone);
    }
  };

  // Volumetric & Chargeable calculations
  const volumetricWeight = (lengthCm * widthCm * heightCm) / 5000;
  const chargeableWeight = Math.max(weightKg, volumetricWeight);

  // Pricing calculations
  const getEstimatedCost = () => {
    let base = 220;
    let ratePerKg = 60;

    if (selectedService === 'CARGO') {
      base = 160;
      ratePerKg = 40;
    } else if (selectedService === 'RUSH') {
      base = 290;
      ratePerKg = 50;
    }

    const weightCost = Math.round(base + Math.max(0, chargeableWeight - 1) * ratePerKg);
    const insuranceCost = addInsurance ? 150 : 0;
    const carbonCost = addCarbonOffset ? 50 : 0;
    const codFee = isCod ? 30 : 0;

    return {
      weightCost,
      insuranceCost,
      carbonCost,
      codFee,
      total: weightCost + insuranceCost + carbonCost + codFee
    };
  };

  const costs = getEstimatedCost();

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
        declaredValueNpr: Number(declaredValueNpr),
      },
    });

    setCreatedShipment(shipment);
    setStep(5);
  };

  const copyTrackingId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-orange" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={13} /> NEPAL DOMESTIC DISPATCH PORTAL
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
            Book a Domestic Consignment
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1rem' }}>
            High-velocity door-to-door express linehaul across all 77 districts with instant airway bills, optical barcodes, and automated Cash on Delivery remittance.
          </p>
        </div>

        {/* ================= AUTH GATE (FALLBACK IF VISITOR LANDS LOGGED OUT) ================= */}
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

            <h2 style={{ fontSize: '1.65rem', marginBottom: '0.5rem' }}>
              Merchant Authentication Required
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: '1.6' }}>
              To ensure parcel security, insurance coverage, and next-day COD bank remittance, <strong>only registered Double 11 merchants can dispatch consignments</strong>.
            </p>

            <div className="tab-list" style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => { setAuthTab('signin'); setAuthError(''); }}
                className={`tab-btn ${authTab === 'signin' ? 'active' : ''}`}
              >
                Merchant Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('signup'); setAuthError(''); }}
                className={`tab-btn ${authTab === 'signup' ? 'active' : ''}`}
              >
                Register New Merchant
              </button>
            </div>

            {authError && (
              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <CheckCircle2 size={16} />
                <span>{authSuccess}</span>
              </div>
            )}

            {authTab === 'signin' ? (
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
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem', width: '100%' }}>
                  <span>Sign In &amp; Dispatch Cargo</span>
                  <ArrowRight size={16} />
                </button>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                    FAST 1-CLICK DEMO ACCOUNTS:
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleDemoSignIn('soben@double11.com')}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontSize: '0.78rem' }}
                    >
                      Soben (Admin)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoSignIn('pradeep@himalayantech.np')}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontSize: '0.78rem' }}
                    >
                      Pradeep (Merchant)
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleInlineSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                <div className="input-group">
                  <label className="input-label">Authorized Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Thapa"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Company / Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kathmandu Handicrafts Pvt Ltd"
                    value={authCompany}
                    onChange={(e) => setAuthCompany(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="ramesh@handicrafts.np"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Mobile Phone (Nepal)</label>
                  <input
                    type="tel"
                    placeholder="+977 98510 00000"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Password</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem', width: '100%' }}>
                  <span>Register &amp; Unlock Booking</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ================= AUTHENTICATED: INTERACTIVE BOOKING WIZARD ================= */
          <div>
            {/* Merchant Status Header Pill */}
            <div style={{
              background: 'rgba(255, 102, 0, 0.08)',
              border: '1px solid rgba(255, 102, 0, 0.25)',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <UserCheck size={18} color="var(--brand-orange)" />
                <span style={{ fontSize: '0.88rem', color: '#ffffff' }}>
                  Authenticated Consignor: <strong>{currentUser.name}</strong> &bull; {currentUser.company}
                </span>
                <span className={currentUser.role === 'admin' ? 'badge badge-orange' : 'badge badge-cyan'} style={{ fontSize: '0.65rem' }}>
                  {currentUser.role === 'admin' ? 'SYSTEM ADMIN' : 'VERIFIED MERCHANT'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {currentUser.role === 'admin' ? (
                  <Link href="/admin" className="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                    <span>Admin Control Tower</span>
                  </Link>
                ) : (
                  <Link href="/merchant" className="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                    <span>Merchant Portal</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                >
                  <LogOut size={12} />
                  <span>Switch</span>
                </button>
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="stepper-nav">
              <button
                type="button"
                onClick={() => step > 1 && setStep(1)}
                className={`stepper-item ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}
              >
                <div className="stepper-badge">{step > 1 ? <Check size={14} /> : '1'}</div>
                <span>1. Shipper (From)</span>
              </button>

              <div style={{ color: 'var(--border-medium)' }}>&rsaquo;</div>

              <button
                type="button"
                onClick={() => step > 2 && setStep(2)}
                className={`stepper-item ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}
                disabled={step < 2}
              >
                <div className="stepper-badge">{step > 2 ? <Check size={14} /> : '2'}</div>
                <span>2. Consignee (To)</span>
              </button>

              <div style={{ color: 'var(--border-medium)' }}>&rsaquo;</div>

              <button
                type="button"
                onClick={() => step > 3 && setStep(3)}
                className={`stepper-item ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}
                disabled={step < 3}
              >
                <div className="stepper-badge">{step > 3 ? <Check size={14} /> : '3'}</div>
                <span>3. Cargo &amp; COD</span>
              </button>

              <div style={{ color: 'var(--border-medium)' }}>&rsaquo;</div>

              <button
                type="button"
                onClick={() => step > 4 && setStep(4)}
                className={`stepper-item ${step === 4 ? 'active' : step > 4 ? 'completed' : ''}`}
                disabled={step < 4}
              >
                <div className="stepper-badge">{step > 4 ? <Check size={14} /> : '4'}</div>
                <span>4. Service Tier</span>
              </button>

              <div style={{ color: 'var(--border-medium)' }}>&rsaquo;</div>

              <button
                type="button"
                className={`stepper-item ${step === 5 ? 'active' : ''}`}
                disabled={step < 5}
              >
                <div className="stepper-badge">5</div>
                <span>5. Waybill &amp; Label</span>
              </button>
            </div>

            {/* If Step 5 (Confirmation), show full-width label view */}
            {step === 5 && createdShipment ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                    color: 'var(--brand-emerald)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)'
                  }}>
                    <CheckCircle2 size={36} />
                  </div>

                  <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    Consignment Confirmed &amp; Dispatched!
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
                    Waybill has been authorized and synchronized with Nepal linehaul routing. Handover to assigned courier unit at {originCity} Hub.
                  </p>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-medium)',
                    marginBottom: '1.5rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TRACKING CODE</div>
                      <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--brand-orange)' }}>
                        {createdShipment.id}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyTrackingId(createdShipment.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem' }}
                    >
                      {copiedTracking ? <Check size={14} color="var(--brand-emerald)" /> : <Copy size={14} />}
                      <span>{copiedTracking ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link href={`/track?id=${createdShipment.id}`} className="btn btn-primary">
                      <span>Track Consignment Live</span>
                      <ArrowRight size={16} />
                    </Link>

                    {currentUser?.role === 'admin' ? (
                      <Link href="/admin" className="btn btn-secondary">
                        <span>Admin Control Tower</span>
                      </Link>
                    ) : (
                      <Link href="/merchant" className="btn btn-secondary">
                        <span>Merchant Portal</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setCreatedShipment(null);
                      }}
                      className="btn btn-outline"
                    >
                      <span>Book Another Parcel</span>
                    </button>
                  </div>
                </div>

                {/* Printable Label & Barcode */}
                <PrintableLabel shipment={createdShipment} />
              </div>
            ) : (
              /* Steps 1 to 4: Two-Column Layout (Form Wizard + Sticky Live Manifest) */
              <div className="booking-layout-grid">
                {/* Left Column: Form Step Wizard */}
                <div className="glass-panel" style={{ padding: '2rem 2.25rem' }}>
                  {/* STEP 1: Shipper & Origin Hub */}
                  {step === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div className="badge badge-orange" style={{ marginBottom: '0.4rem' }}>
                            STEP 1 OF 4 &bull; ORIGIN
                          </div>
                          <h2 style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Package size={22} color="var(--brand-orange)" />
                            <span>Shipper &amp; Collection Hub</span>
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={handleUseMyProfile}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <UserCheck size={13} />
                          <span>Use My Profile</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="input-group">
                          <label className="input-label">Shipper / Contact Name *</label>
                          <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="input-field"
                            placeholder="e.g. Ramesh Thapa"
                            required
                          />
                        </div>

                        <div className="input-group">
                          <label className="input-label">Merchant Company / Brand *</label>
                          <input
                            type="text"
                            value={senderCompany}
                            onChange={(e) => setSenderCompany(e.target.value)}
                            className="input-field"
                            placeholder="e.g. Himalayan Apparel Nepal"
                            required
                          />
                        </div>

                        <div className="input-group">
                          <label className="input-label">Consignor Contact Phone *</label>
                          <input
                            type="tel"
                            value={senderPhone}
                            onChange={(e) => setSenderPhone(e.target.value)}
                            className="input-field"
                            placeholder="+977 98510 12345"
                            required
                          />
                        </div>

                        <div className="input-group">
                          <label className="input-label">Origin Nepal Gateway Hub *</label>
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

                      {/* Helpful Hint */}
                      <div style={{
                        background: 'rgba(255, 102, 0, 0.05)',
                        border: '1px solid rgba(255, 102, 0, 0.2)',
                        borderRadius: '8px',
                        padding: '0.85rem 1rem',
                        fontSize: '0.82rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Info size={16} color="var(--brand-orange)" />
                        <span>Doorstep pickup is complimentary for all registered merchants in Kathmandu Valley, Pokhara, and Birgunj.</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (!senderName.trim() || !senderPhone.trim()) {
                              alert('Please fill in Shipper Contact Name and Phone Number.');
                              return;
                            }
                            setStep(2);
                          }}
                          className="btn btn-primary btn-lg"
                        >
                          <span>Proceed to Recipient</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Consignee & Destination */}
                  {step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <div className="badge badge-orange" style={{ marginBottom: '0.4rem' }}>
                          STEP 2 OF 4 &bull; DESTINATION
                        </div>
                        <h2 style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={22} color="var(--brand-orange)" />
                          <span>Consignee &amp; Delivery Destination</span>
                        </h2>
                      </div>

                      {/* Quick City Presets */}
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          POPULAR DESTINATION HUBS (1-CLICK SELECT):
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {['Pokhara', 'Kathmandu', 'Biratnagar', 'Birgunj', 'Chitwan', 'Butwal', 'Dharan', 'Nepalgunj'].map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => setRecipientCity(city)}
                              className={`preset-chip ${recipientCity === city ? 'active' : ''}`}
                              style={{
                                background: recipientCity === city ? 'rgba(255, 102, 0, 0.2)' : undefined,
                                borderColor: recipientCity === city ? 'var(--brand-orange)' : undefined,
                                color: recipientCity === city ? '#ffffff' : undefined
                              }}
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="input-group">
                          <label className="input-label">Recipient Full Name *</label>
                          <input
                            type="text"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="input-field"
                            placeholder="e.g. Pradeep Gurung"
                            required
                          />
                        </div>

                        <div className="input-group">
                          <label className="input-label">Company / Store Name (Optional)</label>
                          <input
                            type="text"
                            value={recipientCompany}
                            onChange={(e) => setRecipientCompany(e.target.value)}
                            className="input-field"
                            placeholder="e.g. Gurung Electronics Store"
                          />
                        </div>

                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                          <label className="input-label">Street / Area Address (Doorstep Delivery) *</label>
                          <input
                            type="text"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            className="input-field"
                            placeholder="e.g. Lakeside Ward 6, Near Barahi Chowk, Pokhara"
                            required
                          />
                        </div>

                        <div className="input-group">
                          <label className="input-label">Destination City / Region *</label>
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
                            placeholder="e.g. 33700"
                          />
                        </div>

                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                          <label className="input-label">Recipient Mobile Phone (For Delivery OTP &amp; SMS) *</label>
                          <input
                            type="tel"
                            value={recipientPhone}
                            onChange={(e) => setRecipientPhone(e.target.value)}
                            className="input-field"
                            placeholder="+977 98XXXXXXXX"
                            required
                          />
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            Customer will receive real-time SMS alerts with live courier tracking and OTP verification upon delivery.
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">
                          <ArrowLeft size={16} />
                          <span>Back</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!recipientName.trim() || !recipientAddress.trim() || !recipientPhone.trim()) {
                              alert('Please fill in Recipient Name, Address, and Contact Phone.');
                              return;
                            }
                            setStep(3);
                          }}
                          className="btn btn-primary btn-lg"
                        >
                          <span>Proceed to Cargo &amp; COD</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Cargo Specifications & COD */}
                  {step === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <div className="badge badge-orange" style={{ marginBottom: '0.4rem' }}>
                          STEP 3 OF 4 &bull; PARCEL &amp; CASH ON DELIVERY
                        </div>
                        <h2 style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Boxes size={22} color="var(--brand-orange)" />
                          <span>Cargo Specifications &amp; COD Amount</span>
                        </h2>
                      </div>

                      {/* Quick Presets */}
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          QUICK CATEGORY PRESETS:
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => applyPreset('Standard E-Commerce Parcel', 2.0, 25, 18, 12, 3500)}
                            className="preset-chip"
                          >
                            📦 Standard Box (2.0 KG)
                          </button>
                          <button
                            type="button"
                            onClick={() => applyPreset('Important Legal Documents & Contracts', 0.5, 32, 24, 2, 1000)}
                            className="preset-chip"
                          >
                            📄 Documents (0.5 KG)
                          </button>
                          <button
                            type="button"
                            onClick={() => applyPreset('Clothing, Apparel & Knitwear', 3.5, 35, 25, 15, 6000)}
                            className="preset-chip"
                          >
                            👗 Fashion Apparel (3.5 KG)
                          </button>
                          <button
                            type="button"
                            onClick={() => applyPreset('Electronics, Smartphone & Accessories', 1.5, 22, 16, 10, 18000)}
                            className="preset-chip"
                          >
                            💻 Electronics &amp; Gadgets (1.5 KG)
                          </button>
                          <button
                            type="button"
                            onClick={() => applyPreset('Industrial Bulk Spares & Hardware', 12.0, 50, 40, 30, 25000)}
                            className="preset-chip"
                          >
                            🏭 Wholesale Carton (12 KG)
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                          <label className="input-label">Commodity / Package Contents *</label>
                          <input
                            type="text"
                            value={cargoDesc}
                            onChange={(e) => setCargoDesc(e.target.value)}
                            className="input-field"
                            placeholder="e.g. Handicrafts, Men's Shoes, Electronic Components"
                            required
                          />
                        </div>

                        <div className="input-group">
                          <label className="input-label">Number of Pieces (Colli) *</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={pieces}
                            onChange={(e) => setPieces(parseInt(e.target.value) || 1)}
                            className="input-field"
                            required
                          />
                        </div>

                        <div className="input-group">
                          <label className="input-label">Actual Gross Weight (KG) *</label>
                          <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            max="1000"
                            value={weightKg}
                            onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0.5)}
                            className="input-field"
                            required
                          />
                        </div>

                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                          <label className="input-label">Dimensions (L &times; W &times; H cm)</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            <input
                              type="number"
                              placeholder="Length cm"
                              value={lengthCm}
                              onChange={(e) => setLengthCm(parseInt(e.target.value) || 10)}
                              className="input-field"
                              style={{ textAlign: 'center' }}
                            />
                            <input
                              type="number"
                              placeholder="Width cm"
                              value={widthCm}
                              onChange={(e) => setWidthCm(parseInt(e.target.value) || 10)}
                              className="input-field"
                              style={{ textAlign: 'center' }}
                            />
                            <input
                              type="number"
                              placeholder="Height cm"
                              value={heightCm}
                              onChange={(e) => setHeightCm(parseInt(e.target.value) || 5)}
                              className="input-field"
                              style={{ textAlign: 'center' }}
                            />
                          </div>
                        </div>

                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                          <label className="input-label">Declared Cargo Value (Rs. NPR)</label>
                          <input
                            type="number"
                            min="100"
                            value={declaredValueNpr}
                            onChange={(e) => setDeclaredValueNpr(parseFloat(e.target.value) || 1000)}
                            className="input-field"
                          />
                        </div>
                      </div>

                      {/* Cash on Delivery (COD) Card */}
                      <div style={{
                        background: isCod ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
                        border: isCod ? '2px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        transition: 'all var(--transition-fast)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCod ? '1rem' : 0 }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', margin: 0 }}>
                            <input
                              type="checkbox"
                              checked={isCod}
                              onChange={(e) => setIsCod(e.target.checked)}
                              style={{ width: '18px', height: '18px', accentColor: 'var(--brand-emerald)' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                                Cash on Delivery (COD) Collection
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                Rider collects cash from buyer at delivery and remits next business day
                              </div>
                            </div>
                          </label>

                          <span className={isCod ? 'badge badge-emerald' : 'badge badge-subtle'}>
                            {isCod ? 'ACTIVE COD' : 'PREPAID'}
                          </span>
                        </div>

                        {isCod && (
                          <div style={{ borderTop: '1px solid rgba(16, 185, 129, 0.2)', paddingTop: '0.75rem' }}>
                            <div className="input-group">
                              <label className="input-label" style={{ color: 'var(--brand-emerald)', fontWeight: 600 }}>
                                Amount to Collect from Recipient (Rs. NPR) *
                              </label>
                              <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--brand-emerald)' }}>
                                  Rs.
                                </span>
                                <input
                                  type="number"
                                  min="10"
                                  value={codAmountNpr}
                                  onChange={(e) => setCodAmountNpr(parseFloat(e.target.value) || 0)}
                                  className="input-field"
                                  style={{ paddingLeft: '2.5rem', fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700 }}
                                  required
                                />
                              </div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                Bank Remittance: Deposited automatically to your linked merchant bank account every business day at 16:00 NPT.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => setStep(2)} className="btn btn-secondary">
                          <ArrowLeft size={16} />
                          <span>Back</span>
                        </button>
                        <button type="button" onClick={() => setStep(4)} className="btn btn-primary btn-lg">
                          <span>Choose Service Tier</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Service Tier & Tariffs */}
                  {step === 4 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <div className="badge badge-orange" style={{ marginBottom: '0.4rem' }}>
                          STEP 4 OF 4 &bull; SERVICE SELECTION
                        </div>
                        <h2 style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Truck size={22} color="var(--brand-orange)" />
                          <span>Select Domestic Service Tier</span>
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Option 1: Double 11 Nepal Express */}
                        <div
                          onClick={() => setSelectedService('EXP')}
                          className={`service-card-select ${selectedService === 'EXP' ? 'selected' : ''}`}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-orange)', fontWeight: 800 }}>
                              <Truck size={18} />
                              <span>Double 11 Nepal Express</span>
                            </div>
                            <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>24H SLA</span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                            Daily direct electric linehauls connecting Kathmandu, Pokhara, Birgunj, Biratnagar, Chitwan &amp; Butwal.
                          </p>
                          <div style={{ marginTop: 'auto' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                              Rs. {Math.round(220 + Math.max(0, chargeableWeight - 1) * 60)} NPR
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--brand-emerald)', fontWeight: 600 }}>
                              &check; Next-Day Guaranteed Doorstep Delivery
                            </div>
                          </div>
                        </div>

                        {/* Option 2: Nationwide Hub Cargo */}
                        <div
                          onClick={() => setSelectedService('CARGO')}
                          className={`service-card-select ${selectedService === 'CARGO' ? 'selected' : ''}`}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-cyan)', fontWeight: 800 }}>
                              <Boxes size={18} />
                              <span>Nationwide Hub Cargo</span>
                            </div>
                            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>77 DISTRICTS</span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                            Economy bulk freight linehaul across all 7 provinces with warehouse cross-docking (2-3 business days).
                          </p>
                          <div style={{ marginTop: 'auto' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                              Rs. {Math.round(160 + Math.max(0, chargeableWeight - 1) * 40)} NPR
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--brand-cyan)', fontWeight: 600 }}>
                              &check; Lowest Cost for Heavy Inventory
                            </div>
                          </div>
                        </div>

                        {/* Option 3: Same-Day Valley Rush */}
                        <div
                          onClick={() => setSelectedService('RUSH')}
                          className={`service-card-select ${selectedService === 'RUSH' ? 'selected' : ''}`}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-emerald)', fontWeight: 800 }}>
                              <Clock size={18} />
                              <span>Same-Day Valley Rush</span>
                            </div>
                            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>&lt; 3 HOURS</span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                            Direct point-to-point dedicated motorcycle rider across Kathmandu, Lalitpur, and Bhaktapur.
                          </p>
                          <div style={{ marginTop: 'auto' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                              Rs. {Math.round(290 + Math.max(0, chargeableWeight - 1) * 50)} NPR
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--brand-emerald)', fontWeight: 600 }}>
                              &check; Instant Dispatch Within 180 Minutes
                            </div>
                          </div>
                        </div>

                        {/* Option 4: International Air Cargo (COMING SOON) */}
                        <div
                          onClick={() => alert('International Cross-Border Air Cargo is currently in pilot regulatory testing and launches Q4 2026. Please choose a Nepal domestic service tier.')}
                          className="service-card-select"
                          style={{
                            border: '1px dashed rgba(245, 158, 11, 0.4)',
                            background: 'rgba(245, 158, 11, 0.04)',
                            opacity: 0.85
                          }}
                        >
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '12px',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            color: '#000000',
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px'
                          }}>
                            COMING SOON
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-amber)', fontWeight: 800, marginBottom: '0.5rem' }}>
                            <Globe2 size={18} />
                            <span>International Air Freight</span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                            Direct air charter from Tribhuvan International (TIA) to Dubai, Delhi &amp; Guangzhou. Launching Q4 2026.
                          </p>
                          <div style={{ marginTop: 'auto', fontSize: '0.85rem', color: 'var(--brand-amber)', fontWeight: 700 }}>
                            Pilot Registration Active &rarr;
                          </div>
                        </div>
                      </div>

                      {/* Value-Add Options */}
                      <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                          <input
                            type="checkbox"
                            checked={addInsurance}
                            onChange={(e) => setAddInsurance(e.target.checked)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--brand-orange)' }}
                          />
                          <span>
                            All-Risk Domestic Transit Insurance (Covers damage &amp; loss up to Rs. 100,000 NPR) &mdash; <strong>+Rs. 150 NPR</strong>
                          </span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                          <input
                            type="checkbox"
                            checked={addCarbonOffset}
                            onChange={(e) => setAddCarbonOffset(e.target.checked)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--brand-emerald)' }}
                          />
                          <span>
                            Zero-Emission Electric Van Contribution (100% Nepal Hydro-Charged) &mdash; <strong>+Rs. 50 NPR</strong>
                          </span>
                        </label>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => setStep(3)} className="btn btn-secondary">
                          <ArrowLeft size={16} />
                          <span>Back</span>
                        </button>
                        <button type="button" onClick={handleFinishBooking} className="btn btn-primary btn-lg">
                          <span>Authorize &amp; Issue Waybill</span>
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Sticky Live Consignment Manifest & Pricing */}
                <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(255, 102, 0, 0.25)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Navigation size={15} color="var(--brand-orange)" />
                        <span>LIVE DISPATCH MANIFEST</span>
                      </div>
                      <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>
                        {selectedService}
                      </span>
                    </div>

                    {/* Route Graphic */}
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>FROM (ORIGIN)</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{originCity}</div>
                      </div>

                      <div style={{ color: 'var(--brand-orange)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Truck size={18} />
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>LINEHAUL</span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TO (CONSIGNEE)</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{recipientCity}</div>
                      </div>
                    </div>

                    {/* Specifications Summary */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Pieces:</span>
                        <span style={{ fontWeight: 600 }}>{pieces} PKG</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Actual Gross Wt:</span>
                        <span style={{ fontWeight: 600 }}>{weightKg} KG</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Volumetric Wt:</span>
                        <span style={{ fontWeight: 600 }}>{volumetricWeight.toFixed(2)} KG</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Chargeable Wt:</span>
                        <strong style={{ color: 'var(--brand-orange)' }}>{chargeableWeight.toFixed(1)} KG</strong>
                      </div>
                    </div>

                    {/* Cash on Delivery Notice */}
                    {isCod && (
                      <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '6px',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.8rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: 'var(--brand-emerald)', fontWeight: 600 }}>COD to Collect:</span>
                        <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                          Rs. {codAmountNpr.toLocaleString()} NPR
                        </strong>
                      </div>
                    )}

                    {/* Itemized Price Breakdown */}
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Base Freight:</span>
                        <span>Rs. {costs.weightCost}</span>
                      </div>
                      {addInsurance && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Transit Insurance:</span>
                          <span>Rs. {costs.insuranceCost}</span>
                        </div>
                      )}
                      {addCarbonOffset && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Green Fleet Offset:</span>
                          <span>Rs. {costs.carbonCost}</span>
                        </div>
                      )}
                      {isCod && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>COD Handling Fee:</span>
                          <span>Rs. {costs.codFee}</span>
                        </div>
                      )}

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '2px solid var(--border-medium)',
                        paddingTop: '0.75rem',
                        marginTop: '0.35rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL ESTIMATED COST</div>
                          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                            Rs. {costs.total} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>NPR</span>
                          </div>
                        </div>
                        <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                          VAT INCLUDED
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Merchant Guarantee Banner */}
                  <div className="card" style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                      <ShieldCheck size={16} color="var(--brand-emerald)" />
                      <span>Double 11 Service Guarantee</span>
                    </div>
                    <div>100% money-back guarantee if 24h intercity SLA is breached. Full digital audit trail on all Nepal linehauls.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div style={{ padding: '6rem 0', textAlign: 'center' }}>Loading Double 11 Domestic Dispatch Wizard...</div>}>
      <BookContent />
    </Suspense>
  );
}
