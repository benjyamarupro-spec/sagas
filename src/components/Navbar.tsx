'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useWindowSize } from '@/hooks/useWindowSize';

const NAV_LINKS = [
  { label: 'Flights', href: '/flights' },
  { label: 'Deals', href: '/deals' },
  { label: 'Routes', href: '/routes' },
  { label: 'Siargao Guide', href: '/guide' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const width = useWindowSize();
  const isMobile = width > 0 && width < 768;

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'white',
        borderBottom: '1px solid var(--border)',
        padding: isMobile ? '0 20px' : '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        <Logo variant="light" size="md" />

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 32 }}>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} style={{
                fontFamily: 'Syne, system-ui, sans-serif',
                fontWeight: pathname === link.href ? 600 : 400,
                fontSize: 14,
                color: pathname === link.href ? 'var(--lagoon)' : 'var(--lagoon-muted)',
                textDecoration: 'none',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isMobile && (
            <button style={{
              fontFamily: 'Syne, system-ui, sans-serif',
              fontWeight: 600, fontSize: 12,
              background: 'var(--seafoam)',
              color: 'var(--lagoon)',
              border: '1px solid rgba(10,92,84,0.3)',
              borderRadius: 20, padding: '8px 18px',
              cursor: 'pointer',
            }}>
              🔔 Price Alerts
            </button>
          )}

          {/* Hamburger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} color="var(--nightsurf)" /> : <Menu size={24} color="var(--nightsurf)" />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, bottom: 0,
          background: 'white', zIndex: 49,
          display: 'flex', flexDirection: 'column',
          padding: '24px 24px',
          borderTop: '1px solid var(--border)',
        }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'Syne, system-ui, sans-serif',
                fontWeight: pathname === link.href ? 700 : 500,
                fontSize: 20,
                color: pathname === link.href ? 'var(--lagoon)' : 'var(--nightsurf)',
                textDecoration: 'none',
                padding: '16px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: 24,
              fontFamily: 'Syne, system-ui, sans-serif',
              fontWeight: 600, fontSize: 14,
              background: 'var(--seafoam)',
              color: 'var(--lagoon)',
              border: '1px solid rgba(10,92,84,0.3)',
              borderRadius: 20, padding: '12px 24px',
              cursor: 'pointer', width: '100%',
            }}
          >
            🔔 Price Alerts
          </button>
        </div>
      )}
    </>
  );
}
