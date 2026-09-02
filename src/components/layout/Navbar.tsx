'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plane,
  Package,
  Search,
  Menu,
  X,
  Radio,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Cpu
} from 'lucide-react';

export default function Navbar() {
  const [quickTrackId, setQuickTrackId] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTrackId.trim()) return;
    router.push(`/track?id=${encodeURIComponent(quickTrackId.trim())}`);
    setQuickTrackId('');
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(7, 10, 18, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      {/* Top Telemetry Ticker Bar */}
      <div style={{
        backgroundColor: 'rgba(13, 20, 36, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.75rem',
        padding: '0.35rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 600 }}>
            <span className="pulse-dot pulse-dot-green" style={{ width: 6, height: 6 }}></span>
            SYSTEM OPERATIONAL
          </span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span>Double 11 Peak Surge Engine: <strong style={{ color: '#f8fafc' }}>Active (100% Capacity)</strong></span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span className="hide-mobile">Global Hubs: <strong>HKG • PVG • SIN • FRA • LAX • LHR</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--brand-orange)', fontWeight: 600 }}>
            <Radio size={13} className="animate-pulse" /> 24/7 Dispatch Control
          </span>
          <Link href="/operations" style={{
            fontSize: '0.72rem',
            background: 'rgba(255, 102, 0, 0.15)',
            color: '#ff8533',
            padding: '0.15rem 0.6rem',
            borderRadius: '4px',
            border: '1px solid rgba(255, 102, 0, 0.3)',
            fontWeight: 600
          }}>
            Operations Tower
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.75rem' }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #ff6600 0%, #b33900 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(255, 102, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              fontFamily: 'var(--font-mono)',
              color: '#ffffff',
              letterSpacing: '-1px'
            }}>11</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                DOUBLE <span style={{ color: 'var(--brand-orange)' }}>11</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px',
                letterSpacing: '0.08em',
                color: 'var(--brand-cyan)'
              }}>LOGISTICS</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
              Intelligent Global Supply Chain
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hide-tablet" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <Link href="/track" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', transition: 'color 0.15s' }}>
            Tracking Center
          </Link>
          <Link href="/book" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', transition: 'color 0.15s' }}>
            Book Cargo
          </Link>
          <Link href="/rates" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', transition: 'color 0.15s' }}>
            Rates & Tariffs
          </Link>
          <Link href="/operations" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--brand-amber)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Cpu size={15} /> Control Tower
          </Link>
          <Link href="/about" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', transition: 'color 0.15s' }}>
            About & Founder
          </Link>
          <Link href="/support" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', transition: 'color 0.15s' }}>
            Support
          </Link>
        </nav>

        {/* Right Action: Quick Track Input + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <form onSubmit={handleQuickTrack} className="hide-mobile" style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Track AWB # (e.g. D11-8892)"
              value={quickTrackId}
              onChange={(e) => setQuickTrackId(e.target.value)}
              style={{
                background: 'rgba(18, 27, 48, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.55rem 2.25rem 0.55rem 0.85rem',
                fontSize: '0.82rem',
                color: '#ffffff',
                width: '210px',
                outline: 'none',
                fontFamily: 'var(--font-mono)'
              }}
            />
            <button
              type="submit"
              aria-label="Search Tracking ID"
              style={{
                position: 'absolute',
                right: '8px',
                background: 'transparent',
                border: 'none',
                color: 'var(--brand-orange)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Search size={15} />
            </button>
          </form>

          <Link href="/book" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Ship Now</span>
            <ArrowRight size={14} />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0.55rem',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'none'
            }}
            className="show-tablet"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-medium)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <form onSubmit={handleQuickTrack} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Track AWB # (e.g. D11-8892)"
              value={quickTrackId}
              onChange={(e) => setQuickTrackId(e.target.value)}
              className="input-field"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Track
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', color: 'var(--text-primary)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              Tracking Center
            </Link>
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', color: 'var(--text-primary)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              Book Cargo
            </Link>
            <Link
              href="/rates"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', color: 'var(--text-primary)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              Rates & Tariffs
            </Link>
            <Link
              href="/operations"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', color: 'var(--brand-amber)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              Control Tower (Operations)
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', color: 'var(--text-primary)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              About Double 11 & Founder
            </Link>
            <Link
              href="/support"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', color: 'var(--text-primary)', fontWeight: 600 }}
            >
              Customer Support
            </Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 900px) {
          .hide-tablet { display: none !important; }
          .show-tablet { display: flex !important; }
        }
        @media (max-width: 600px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
