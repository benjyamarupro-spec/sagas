import Logo from './Logo';
import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'Deals', href: '/deals' },
  { label: 'Routes', href: '/routes' },
  { label: 'Guide', href: '/guide' },
  { label: 'Contact', href: '#' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--lagoon)' }}>
      <div style={{
        padding: '28px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
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

        <div style={{ display: 'flex', gap: 24 }}>
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
