'use client';
import { useState } from 'react';
import { PlaneLanding, Search, Filter } from 'lucide-react';
import Link from 'next/link';

const ALL_FLIGHTS = [
  { id:1, from:'CEB', fromCity:'Cebu', to:'IAO', depart:'06:00', arrive:'06:55', duration:'55 min', price:1850, badge:'Best price today', badgeType:'best' },
  { id:2, from:'CEB', fromCity:'Cebu', to:'IAO', depart:'09:30', arrive:'10:25', duration:'55 min', price:1980, badge:null, badgeType:null },
  { id:3, from:'CEB', fromCity:'Cebu', to:'IAO', depart:'12:00', arrive:'12:55', duration:'55 min', price:2100, badge:'🔥 Only 4 seats', badgeType:'urgent' },
  { id:4, from:'CEB', fromCity:'Cebu', to:'IAO', depart:'15:30', arrive:'16:25', duration:'55 min', price:1920, badge:null, badgeType:null },
  { id:5, from:'CEB', fromCity:'Cebu', to:'IAO', depart:'17:00', arrive:'17:55', duration:'55 min', price:2050, badge:'⏱ Price valid 6h', badgeType:'warning' },
  { id:6, from:'IAO', fromCity:'Siargao', to:'CEB', depart:'07:30', arrive:'08:25', duration:'55 min', price:1850, badge:'Best price today', badgeType:'best' },
  { id:7, from:'IAO', fromCity:'Siargao', to:'CEB', depart:'11:00', arrive:'11:55', duration:'55 min', price:1980, badge:null, badgeType:null },
  { id:8, from:'IAO', fromCity:'Siargao', to:'CEB', depart:'14:30', arrive:'15:25', duration:'55 min', price:2100, badge:null, badgeType:null },
];

export default function FlightsPage() {
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('cheapest');
  const [timeFilter, setTimeFilter] = useState('all');

  const filtered = ALL_FLIGHTS
    .filter(f => f.price <= maxPrice)
    .filter(f => {
      if (timeFilter === 'morning') return parseInt(f.depart) < 12;
      if (timeFilter === 'afternoon') return parseInt(f.depart) >= 12 && parseInt(f.depart) < 18;
      if (timeFilter === 'evening') return parseInt(f.depart) >= 18;
      return true;
    })
    .sort((a, b) => sortBy === 'cheapest' ? a.price - b.price : a.depart.localeCompare(b.depart));

  const badgeStyle = (type: string | null) => {
    if (type === 'best') return { bg: 'var(--seafoam)', color: 'var(--lagoon)' };
    if (type === 'urgent') return { bg: 'var(--coral-light)', color: 'var(--coral)' };
    if (type === 'warning') return { bg: 'var(--golden-light)', color: '#7A5A00' };
    return { bg: 'var(--seafoam)', color: 'var(--lagoon)' };
  };

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--nightsurf)', padding: '40px 40px 48px' }}>
        <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> / Flights
        </p>
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 36, color: 'white', marginBottom: 6 }}>
          Sunlight Air — Flights to Siargao
        </h1>
        <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
          Direct flights between Cebu (CEB) and Siargao (IAO)
        </p>
      </div>

      {/* Content */}
      <div style={{ background: 'var(--seafoam)', padding: '32px 40px', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>

          {/* Sidebar */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: 20, height: 'fit-content' }}>
            <div style={{ background: 'var(--seafoam)', borderRadius: 20, padding: '6px 14px', display: 'inline-block', marginBottom: 20 }}>
              <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 12, color: 'var(--lagoon)' }}>✈ Sunlight Air only</span>
            </div>

            {[
              { label: 'SORT BY', content: (
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: '100%', padding: '8px', fontFamily: 'Syne', fontSize: 13, border: '1px solid var(--border)', borderRadius: 8, color: 'var(--nightsurf)' }}>
                  <option value="cheapest">Cheapest first</option>
                  <option value="time">Departure time</option>
                </select>
              )},
              { label: 'PRICE RANGE', content: (
                <div>
                  <input type="range" min={0} max={5000} step={50} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--lagoon)' }} />
                  <p style={{ fontFamily: 'Syne', fontSize: 12, color: 'var(--lagoon)', fontWeight: 800 }}>Up to ₱{maxPrice.toLocaleString()}</p>
                </div>
              )},
              { label: 'DEPARTURE TIME', content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[['all','All times'],['morning','Morning 6–12'],['afternoon','Afternoon 12–18'],['evening','Evening 18+']].map(([v,l]) => (
                    <button key={v} onClick={() => setTimeFilter(v)} style={{ padding: '8px', fontFamily: 'Syne', fontSize: 12, background: timeFilter === v ? 'var(--lagoon)' : 'var(--seafoam)', color: timeFilter === v ? 'white' : 'var(--lagoon-muted)', border: 'none', borderRadius: 6, cursor: 'pointer', textAlign: 'left' }}>
                      {l}
                    </button>
                  ))}
                </div>
              )},
            ].map((section, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 10, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>{section.label}</p>
                {section.content}
              </div>
            ))}
          </div>

          {/* Results */}
          <div>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)', marginBottom: 16 }}>
              {filtered.length} Sunlight Air flights found
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map((f, idx) => {
                const bs = badgeStyle(f.badgeType);
                return (
                  <div key={f.id} style={{ background: 'white', borderRadius: 12, border: `${f.badgeType === 'best' ? '2px' : '1px'} solid ${f.badgeType === 'best' ? 'var(--lagoon)' : 'var(--border)'}`, padding: 20, display: 'flex', alignItems: 'center', gap: 20, position: 'relative' }}>
                    {f.badge && (
                      <span style={{ position: 'absolute', top: 12, right: 16, background: bs.bg, color: bs.color, borderRadius: 20, padding: '4px 10px', fontFamily: 'Syne', fontWeight: 600, fontSize: 11 }}>
                        {f.badge}
                      </span>
                    )}
                    <div style={{ width: 44, height: 44, background: 'var(--seafoam)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: 'var(--lagoon)' }}>SA</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: 'var(--lagoon-muted)', marginBottom: 4 }}>Sunlight Air · direct · 55 min</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--nightsurf)' }}>{f.depart}</span>
                        <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 13, color: 'var(--lagoon-muted)' }}>{f.from}</span>
                        <PlaneLanding size={16} color="var(--lagoon-muted)" />
                        <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--nightsurf)' }}>{f.arrive}</span>
                        <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 13, color: 'var(--lagoon)' }}>{f.to}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)' }}>from</p>
                      <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 26, color: 'var(--lagoon)' }}>₱{f.price.toLocaleString()}</p>
                      <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)', marginBottom: 8 }}>per person</p>
                      <a href="#" target="_blank" rel="noopener noreferrer" style={{ background: 'var(--lagoon)', color: 'white', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne', fontWeight: 800, fontSize: 12, textDecoration: 'none', display: 'inline-block' }}>
                        Book now →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
