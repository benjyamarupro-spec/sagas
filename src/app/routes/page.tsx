'use client';
import { useState } from 'react';
import { PlaneLanding, PlaneTakeoff, Clock, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useWindowSize } from '@/hooks/useWindowSize';

export default function RoutesPage() {
  const [direction, setDirection] = useState<'to'|'from'>('to');
  const width = useWindowSize();
  const isMobile = width > 0 && width < 768;

  const routes = [
    {
      from: 'Cebu', fromCode: 'CEB', fromAirport: 'Mactan-Cebu International',
      to: 'Siargao', toCode: 'IAO', toAirport: 'Sayak Airport',
      type: 'direct', duration: '55 min', airline: 'Sunlight Air',
      frequency: 'Up to 5 flights/day', minPrice: 1850, avgPrice: 2100,
    },
    {
      from: 'Siargao', fromCode: 'IAO', fromAirport: 'Sayak Airport',
      to: 'Cebu', toCode: 'CEB', toAirport: 'Mactan-Cebu International',
      type: 'direct', duration: '55 min', airline: 'Sunlight Air',
      frequency: 'Up to 5 flights/day', minPrice: 1850, avgPrice: 2100,
    },
    {
      from: 'Clark (Angeles)', fromCode: 'CRK', fromAirport: 'Clark International Airport',
      to: 'Siargao', toCode: 'IAO', toAirport: 'Sayak Airport',
      type: 'direct', duration: '2h 30min', airline: 'Sunlight Air',
      frequency: '2 flights/day', minPrice: 4300, avgPrice: 4700,
    },
    {
      from: 'Siargao', fromCode: 'IAO', fromAirport: 'Sayak Airport',
      to: 'Clark (Angeles)', toCode: 'CRK', toAirport: 'Clark International Airport',
      type: 'direct', duration: '2h 30min', airline: 'Sunlight Air',
      frequency: '2 flights/day', minPrice: 4300, avgPrice: 4700,
    },
  ];

  const filtered = direction === 'to'
    ? routes.filter(r => r.toCode === 'IAO')
    : routes.filter(r => r.fromCode === 'IAO');

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--nightsurf)', padding: isMobile ? '32px 20px 40px' : '48px 40px 56px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: isMobile ? 28 : 40, color: 'white', marginBottom: 8 }}>
            All routes to & from Siargao
          </h1>
          <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: isMobile ? 14 : 16, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>
            Direct Sunlight Air flights between Cebu and Siargao Island (IAO).
          </p>

          {/* Direction toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxWidth: isMobile ? '100%' : 400, background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 4 }}>
            {(['to','from'] as const).map(d => (
              <button key={d} onClick={() => setDirection(d)} style={{
                padding: '12px', fontFamily: 'Syne', fontWeight: 800, fontSize: isMobile ? 12 : 13,
                background: direction === d ? 'white' : 'transparent',
                color: direction === d ? 'var(--lagoon)' : 'rgba(255,255,255,0.5)',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.2s',
              }}>
                {d === 'to' ? <PlaneLanding size={14}/> : <PlaneTakeoff size={14}/>}
                {d === 'to' ? 'Routes TO Siargao' : 'Routes FROM Siargao'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ background: 'var(--seafoam)', padding: isMobile ? '24px 16px 40px' : '40px 40px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {filtered.map((route, i) => (
            <div key={i} style={{ background: 'white', border: '2px solid var(--lagoon)', borderRadius: 12, overflow: 'hidden' }}>
              {/* Top badge */}
              <div style={{ background: 'var(--seafoam)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'var(--lagoon)', color: 'white', borderRadius: 20, padding: '4px 12px', fontFamily: 'Syne', fontWeight: 800, fontSize: 11 }}>
                  ✈ DIRECT
                </span>
                <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 12, color: 'var(--lagoon-muted)' }}>
                  Sunlight Air · ATR 72 turboprop
                </span>
              </div>

              <div style={{ padding: isMobile ? 18 : 28 }}>
                {/* Route */}
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, marginBottom: 18 }}>
                  <div>
                    <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: isMobile ? 22 : 28, color: 'var(--nightsurf)' }}>{route.fromCode}</p>
                    <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 12, color: 'var(--lagoon-muted)' }}>{route.from}</p>
                    {!isMobile && <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)', opacity: 0.7 }}>{route.fromAirport}</p>}
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <PlaneLanding size={isMobile ? 16 : 20} color="var(--lagoon)"/>
                      <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 11, color: 'var(--lagoon)' }}>{route.duration}</span>
                    </div>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: isMobile ? 22 : 28, color: 'var(--lagoon)' }}>{route.toCode}</p>
                    <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 12, color: 'var(--lagoon-muted)' }}>{route.to}</p>
                    {!isMobile && <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)', opacity: 0.7 }}>{route.toAirport}</p>}
                  </div>
                </div>

                {/* Info grid — 2 cols on mobile, 3 on desktop */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 14, marginBottom: 20, padding: '14px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                  {[
                    { icon: <Clock size={16} color="var(--lagoon)"/>, label: 'Duration', value: route.duration },
                    { icon: <Users size={16} color="var(--lagoon)"/>, label: 'Frequency', value: route.frequency },
                    { icon: <ArrowRight size={16} color="var(--lagoon)"/>, label: 'Stops', value: 'Direct only' },
                  ].map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 32, height: 32, background: 'var(--seafoam)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 10, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{item.label}</p>
                        <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: 'var(--nightsurf)' }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prices + CTA */}
                <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 14 : 0 }}>
                  <div style={{ display: 'flex', gap: 28 }}>
                    <div>
                      <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)', marginBottom: 2 }}>Cheapest today</p>
                      <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 24, color: 'var(--lagoon)' }}>₱{route.minPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)', marginBottom: 2 }}>Avg price</p>
                      <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 18, color: 'var(--lagoon-muted)' }}>₱{route.avgPrice.toLocaleString()}</p>
                    </div>
                  </div>
                  <Link href={`/flights?from=${route.fromCode}&to=${route.toCode}&routeFilter=${route.fromCode === 'CRK' || route.toCode === 'CRK' ? 'crk' : 'ceb'}`} style={{
                    background: 'var(--lagoon)', color: 'white', borderRadius: 8,
                    padding: '14px 24px', fontFamily: 'Syne', fontWeight: 800, fontSize: 13,
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
                    width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'center' : 'flex-start',
                  }}>
                    Search flights on this route <ArrowRight size={14}/>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Pro tip */}
          <div style={{ background: 'var(--golden-light)', border: '1px solid rgba(232,180,74,0.4)', borderRadius: 12, padding: '18px 20px' }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: '#7A5A00', lineHeight: 1.6 }}>
              💡 <strong>Pro tip:</strong> Clark Airport (CRK) is your best gateway from Luzon. It's 2h from Manila by P2P bus (₱250), and Sunlight Air flies direct to Siargao in 2h30. Much less stressful than flying via NAIA.
            </p>
          </div>

          {/* Coming soon */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 15, color: 'var(--nightsurf)', marginBottom: 6 }}>All Sunlight Air routes listed</p>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)' }}>
              SAGAS currently lists all confirmed Sunlight Air routes to Siargao. Routes are updated as Sunlight Air expands its network in 2025–2026.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
