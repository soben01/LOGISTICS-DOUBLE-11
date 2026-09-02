'use client';

import React, { useState, Suspense } from 'react';
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
  QrCode,
  ShieldCheck,
  Printer,
  Boxes,
  Sparkles,
  Barcode
} from 'lucide-react';
import { createShipment, Shipment } from '../../lib/store';

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialService = (searchParams.get('service') as Shipment['serviceCode']) || 'EXP';
  const initialOrigin = searchParams.get('origin') || 'HKG';
  const initialDest = searchParams.get('dest') || 'USA';
  const initialWt = parseFloat(searchParams.get('wt') || '5');

  const [step, setStep] = useState(1);

  // Form State
  const [senderName, setSenderName] = useState('Apex Technologies');
  const [senderCompany, setSenderCompany] = useState('Apex Trade Global Ltd');
  const [senderPhone, setSenderPhone] = useState('+852 2891 9900');
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

  const handleFinishBooking = () => {
    let serviceName: Shipment['service'] = 'Double 11 Super Express';
    if (selectedService === 'AIR') serviceName = 'Cross-Border Air Priority';
    else if (selectedService === 'SEA') serviceName = 'Ocean Container FCL';
    else if (selectedService === 'FUL') serviceName = 'Smart Hub Fulfillment';

    const shipment = createShipment({
      service: serviceName,
      serviceCode: selectedService,
      origin: {
        city: originCity,
        country: originCountry,
        hub: `${originCity} International Gateway`,
      },
      destination: {
        city: recipientCity,
        country: recipientCountry,
        hub: `${recipientCity} Distribution Center`,
        postalCode: recipientPostal,
      },
      sender: {
        name: senderName,
        company: senderCompany,
        phone: senderPhone,
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
        declaredValueUsd: Number(declaredValue),
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
                  <label className="input-label">Origin Country / Gateway</label>
                  <select
                    value={originCountry}
                    onChange={(e) => {
                      setOriginCountry(e.target.value);
                      if (e.target.value === 'HKG') setOriginCity('Hong Kong');
                      else if (e.target.value === 'CHN') setOriginCity('Shenzhen');
                      else if (e.target.value === 'SGP') setOriginCity('Singapore');
                      else if (e.target.value === 'JPN') setOriginCity('Tokyo');
                      else setOriginCity('Frankfurt');
                    }}
                    className="select-field"
                  >
                    <option value="HKG">Hong Kong (HKG Terminal 1)</option>
                    <option value="CHN">Shenzhen / Shanghai (CHN Hub)</option>
                    <option value="SGP">Singapore (Changi SIN)</option>
                    <option value="JPN">Tokyo (Narita NRT)</option>
                    <option value="DEU">Frankfurt (FRA CargoCity)</option>
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
                <span>Step 2: Consignee & Delivery Address</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label">Recipient Name</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Company (Optional)</label>
                  <input
                    type="text"
                    value={recipientCompany}
                    onChange={(e) => setRecipientCompany(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Street Address</label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="input-field"
                    placeholder="Street, suite, floor"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">City</label>
                  <input
                    type="text"
                    value={recipientCity}
                    onChange={(e) => setRecipientCity(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Destination Country</label>
                  <select
                    value={recipientCountry}
                    onChange={(e) => setRecipientCountry(e.target.value)}
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
                  <label className="input-label">Postal / Zip Code</label>
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
                <span>Step 4: Select Service Tier & Protection</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Option 1: Super Express */}
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
                      <Plane size={18} />
                      <span>Double 11 Super Express</span>
                    </div>
                    <span className="badge badge-orange">Fastest</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                    Dedicated transpacific/Eurasian cargo jet with guaranteed 24-48h departure.
                  </p>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    Est. ${(45 + weightKg * 9.5).toFixed(0)} USD
                  </div>
                </div>

                {/* Option 2: Air Priority */}
                <div
                  onClick={() => setSelectedService('AIR')}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    border: selectedService === 'AIR' ? '2px solid var(--brand-orange)' : undefined,
                    background: selectedService === 'AIR' ? 'rgba(255, 102, 0, 0.06)' : undefined
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-cyan)', fontWeight: 700 }}>
                      <Plane size={18} />
                      <span>Cross-Border Air Priority</span>
                    </div>
                    <span className="badge badge-cyan">Popular</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                    Standard commercial air cargo with 3-4 business day customs clearance.
                  </p>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    Est. ${(28 + weightKg * 6.2).toFixed(0)} USD
                  </div>
                </div>

                {/* Option 3: Smart Fulfillment */}
                <div
                  onClick={() => setSelectedService('FUL')}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    border: selectedService === 'FUL' ? '2px solid var(--brand-orange)' : undefined,
                    background: selectedService === 'FUL' ? 'rgba(255, 102, 0, 0.06)' : undefined
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-amber)', fontWeight: 700 }}>
                      <Boxes size={18} />
                      <span>Double 11 Smart Fulfillment</span>
                    </div>
                    <span className="badge badge-amber">E-Com</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                    Automated robotic pick, pack, and consolidated parcel dispatch (4-6 days).
                  </p>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    Est. ${(18 + weightKg * 4.8).toFixed(0)} USD
                  </div>
                </div>

                {/* Option 4: Ocean FCL */}
                <div
                  onClick={() => setSelectedService('SEA')}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    border: selectedService === 'SEA' ? '2px solid var(--brand-orange)' : undefined,
                    background: selectedService === 'SEA' ? 'rgba(255, 102, 0, 0.06)' : undefined
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-emerald)', fontWeight: 700 }}>
                      <Ship size={18} />
                      <span>Ocean Container FCL / LCL</span>
                    </div>
                    <span className="badge badge-emerald">Bulk</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                    Economical maritime shipping for pallets or full container loads (14-20 days).
                  </p>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    Est. ${(75 + weightKg * 1.5).toFixed(0)} USD
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
                  Your shipment has been pre-registered in the Double 11 network. Below is your official digital Airway Bill.
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
                      DOUBLE 11 LOGISTICS &middot; AIRWAY BILL
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                      Global Fast-Track Priority &middot; IATA Accredit &middot; Dispatch Node #89
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
                    <div>Gateway: {createdShipment.origin.hub}</div>
                    <div>Phone: {createdShipment.sender.phone}</div>
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, color: '#6b7280', fontSize: '0.75rem' }}>CONSIGNEE (TO):</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{createdShipment.recipient.name}</div>
                    <div>{createdShipment.recipient.company}</div>
                    <div>{createdShipment.recipient.address}</div>
                    <div>{createdShipment.destination.city}, {createdShipment.destination.country} &middot; {createdShipment.destination.postalCode}</div>
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
                    <div style={{ fontWeight: 700 }}>${createdShipment.cargo.declaredValueUsd} USD</div>
                  </div>
                </div>

                {/* Barcode & Signature Graphic */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', letterSpacing: '4px', fontWeight: 800 }}>
                      ||||| | |||| ||| |||||| || |||
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
                      {createdShipment.telemetry.airwayBill}
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
