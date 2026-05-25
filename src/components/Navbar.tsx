'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

const NAV_LINKS = [
  { label: 'Flights', href: '/flights' },
  { label: 'Deals', href: '/deals' },
  { label: 'Routes', href: '/routes' },
  { label: 'Siargao Guide', href: '/guide' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'white',
      borderBottom: '1px solid var(--border)',
      padding: '0 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 64,
    }}>
      <Logo variant="light" size="md" />

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
    </nav>
  );
}
