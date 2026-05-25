'use client';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ variant = 'light', size = 'md' }: LogoProps) {
  const isLight = variant === 'light';
  const color = isLight ? '#0A5C54' : 'white';
  const sizes = { sm: { svg: 18, text: 16 }, md: { svg: 22, text: 20 }, lg: { svg: 28, text: 26 } };
  const s = sizes[size];

  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', outline: 'none' }}>
      <svg viewBox="0 0 82 74" width={s.svg} height={s.svg * 0.9}>
        <path
          d="M 8 60 C 8 36, 20 36, 26 46 C 32 56, 44 56, 50 40 C 56 24, 64 12, 70 10"
          fill="none" stroke={color} strokeWidth="5.5" strokeLinecap="round"
        />
        <circle cx="70" cy="10" r="7.5" fill="#E8B44A" />
      </svg>
      <span style={{
        fontFamily: 'Syne, system-ui, sans-serif',
        fontWeight: 800,
        fontSize: s.text,
        letterSpacing: '2px',
        color: color,
      }}>
        SAGAS
      </span>
    </Link>
  );
}
