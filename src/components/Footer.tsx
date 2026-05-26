'use client';
import Logo from './Logo';
import Link from 'next/link';
import { useWindowSize } from '@/hooks/useWindowSize';

const FOOTER_LINKS = [
  { label: 'Deals', href: '/deals' },
  { label: 'Routes', href: '/routes' },
  { label: 'Guide', href: '/guide' },
  { label: 'Contact', href: '#' },
];

export default function Footer() {
  const width = useWindowSize();
  const isMobile = width > 0 && width < 768;

  return (
    <footer style={{ background: 'var(--lagoon)' }}>
      <div style={{
        padding: isMobile ? '28px 20px' : '28px 40px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? 20 : 0,
        textAlign: isMobile ? 'center' : 'left',
      }}>
        <div style={{ width: isMobile ? '100%' : 'auto', display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}>
          <Logo variant="dark" size="md" />
          <p style={{
            fontFamily: 'Syne, system-ui, sans-serif',
            fontWeight: 400, fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            marginTop: 6,
          }}>
            The Siargao flights reference · Philippines
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: isMobile ? 'center' : 'flex-end' }}>
          {FOOTER_LINKS.map(link => (
            <Link key={link.href} href={link.href} style={{
              fontFamily: 'Syne, system-ui, sans-serif',
              fontWeight: 400, fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
            }}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '14px 40px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'Syne, system-ui, sans-serif',
          fontWeight: 400, fontSize: 11,
          color: 'rgba(255,255,255,0.3)',
        }}>
          © 2025 SAGAS · Built by locals, for travelers · Philippines
        </p>
      </div>
    </footer>
  );
}
