'use client';

import React, { useState, useEffect } from 'react';
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
  Cpu,
  User as UserIcon,
  LogOut,
  Lock
} from 'lucide-react';
import { getCurrentUser, logoutUser, User } from '../../lib/auth';

export default function Navbar() {
  const [quickTrackId, setQuickTrackId] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      setCurrentUser(getCurrentUser());
    };
    checkUser();

    window.addEventListener('auth-change', checkUser);
    window.addEventListener('storage', checkUser);
    return () => {
      window.removeEventListener('auth-change', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

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
      backgroundColor: 'rgba(7, 10, 18, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      width: '100%'
    }}>
      {/* Top Telemetry Ticker Bar */}
      <div style={{
        backgroundColor: 'rgba(13, 20, 36, 0.98)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        fontSize: '0.75rem',
        padding: '0.4rem 0',
        color: 'var(--text-secondary)',
        width: '100%'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'nowrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            minWidth: 0
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700, flexShrink: 0 }}>
              <span className="pulse-dot pulse-dot-green" style={{ width: 6, height: 6 }}></span>
              DOMESTIC NEPAL: 100% ACTIVE
            </span>
            <span style={{ color: 'var(--border-medium)', flexShrink: 0 }}>|</span>
            <span className="ticker-hide-sm" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
              Hubs: <strong style={{ color: '#f8fafc' }}>KTM &bull; Pokhara &bull; Birgunj &bull; Biratnagar &bull; Chitwan &bull; Butwal</strong>
            </span>
            <span style={{ color: 'var(--border-medium)', flexShrink: 0 }} className="ticker-hide-md">|</span>
            <span className="ticker-hide-md" style={{ whiteSpace: 'nowrap', color: 'var(--brand-amber)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Globe2 size={12} /> International Cross-Border: <strong style={{ color: '#ffffff', background: 'rgba(245, 158, 11, 0.2)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>Coming Soon</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--brand-orange)', fontWeight: 600, fontSize: '0.72rem' }} className="ticker-hide-sm">
              <Radio size={12} className="animate-pulse" /> 24/7 Dispatch Control
            </span>
            <Link href="/operations" style={{
              fontSize: '0.7rem',
              background: 'rgba(255, 102, 0, 0.15)',
              color: '#ff8533',
              padding: '0.2rem 0.65rem',
              borderRadius: '4px',
              border: '1px solid rgba(255, 102, 0, 0.35)',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              whiteSpace: 'nowrap'
            }}>
              <Cpu size={12} /> Control Tower
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar Row */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.75rem',
        gap: '1.25rem',
        flexWrap: 'nowrap'
      }}>
        {/* Brand Logo - Strictly Non-Wrapping & Fixed */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          flexShrink: 0,
          whiteSpace: 'nowrap'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #ff6600 0%, #b33900 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(255, 102, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            flexShrink: 0
          }}>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              fontFamily: 'var(--font-mono)',
              color: '#ffffff',
              letterSpacing: '-1px'
            }}>11</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, whiteSpace: 'nowrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', whiteSpace: 'nowrap' }}>
                DOUBLE <span style={{ color: 'var(--brand-orange)' }}>11</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                letterSpacing: '0.08em',
                color: 'var(--brand-cyan)',
                whiteSpace: 'nowrap'
              }}>LOGISTICS</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
              Nepal Nationwide &bull; International Coming Soon
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop-links" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
          <Link href="/track" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            Tracking Center
          </Link>
          <Link href="/book" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            Book Cargo
          </Link>
          <Link href="/rates" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            Rates &amp; Tariffs
          </Link>
          <Link href="/operations" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--brand-amber)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
            <Cpu size={15} /> Control Tower
          </Link>
          <Link href="/about" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            About &amp; Founder
          </Link>
          <Link href="/support" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            Support
          </Link>
        </nav>

        {/* Right Action Bar: Quick Track + Auth + CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexShrink: 0,
          whiteSpace: 'nowrap'
        }}>
          {/* Quick Track Input - Collapses cleanly on smaller viewports */}
          <form onSubmit={handleQuickTrack} className="nav-search-desktop" style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <input
              type="text"
              placeholder="Track AWB # (e.g. D11-8892)"
              value={quickTrackId}
              onChange={(e) => setQuickTrackId(e.target.value)}
              style={{
                background: 'rgba(18, 27, 48, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.55rem 2.25rem 0.55rem 0.85rem',
                fontSize: '0.82rem',
                color: '#ffffff',
                width: '190px',
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

          {/* User Auth Display */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff6600 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  flexShrink: 0
                }}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="nav-user-details" style={{ fontSize: '0.8rem', lineHeight: '1.2', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--brand-cyan)' }}>{currentUser.company}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Sign Out"
                style={{ padding: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              <UserIcon size={14} />
              <span>Sign In</span>
            </Link>
          )}

          <Link href="/book" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
            <span>Ship Now</span>
            <ArrowRight size={14} />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="nav-mobile-toggle"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0.55rem',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-medium)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {currentUser ? (
            <div style={{
              padding: '0.85rem 1rem',
              background: 'var(--bg-surface)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff' }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.email} &bull; {currentUser.company}</div>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center' }}
            >
              <UserIcon size={14} /> Sign In / Register
            </Link>
          )}

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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.25rem' }}>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.6rem 0', color: 'var(--text-primary)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              Tracking Center
            </Link>
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.6rem 0', color: 'var(--text-primary)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              Book Cargo
            </Link>
            <Link
              href="/rates"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.6rem 0', color: 'var(--text-primary)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              Rates &amp; Tariffs
            </Link>
            <Link
              href="/operations"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.6rem 0', color: 'var(--brand-amber)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Cpu size={15} /> Control Tower (Operations)
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.6rem 0', color: 'var(--text-primary)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              About Double 11 &amp; Founder
            </Link>
            <Link
              href="/support"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.6rem 0', color: 'var(--text-primary)', fontWeight: 600 }}
            >
              Customer Support
            </Link>
          </div>
        </div>
      )}

      {/* Breakpoint Style Rules */}
      <style jsx global>{`
        /* Hide search on widths under 1280px to prevent crowding */
        @media (max-width: 1280px) {
          .nav-search-desktop {
            display: none !important;
          }
          .ticker-hide-md {
            display: none !important;
          }
        }

        /* Responsive tablet breakpoint: when window is < 1080px or zoomed in, switch to drawer */
        @media (max-width: 1080px) {
          .nav-desktop-links {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: flex !important;
          }
          .nav-user-details {
            display: none !important;
          }
        }

        /* Mobile ticker hide */
        @media (max-width: 700px) {
          .ticker-hide-sm {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
