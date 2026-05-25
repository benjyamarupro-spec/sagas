'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlaneLanding, PlaneTakeoff, Lock, Search, Bell, ChevronRight, Waves, Music, Trees, Droplets, BookOpen, Calendar } from 'lucide-react';

// --- DONNÉES ---
const ROUTES = [
  { icon: '✈', from: 'Cebu', code: 'CEB', price: '₱1,850', duration: '55 min', type: 'direct', href: '/flights?from=CEB' },
  { icon: '✈', from: 'Siargao', code: 'IAO', price: '₱1,850', duration: '55 min', type: 'direct', href: '/flights?from=IAO' },
];

const VIBES = [
  {
    icon: Waves, name: 'Cloud 9', desc: 'The legendary barrel wave. World-class surf, pro competitions, pure stoke.',
    tag: 'Surf · Legend', tagBg: 'var(--seafoam)', tagColor: 'var(--lagoon)',
    iconBg: 'var(--seafoam)', iconColor: 'var(--lagoon)',
    img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&h=300&fit=crop&q=80',
  },
  {
    icon: Music, name: 'General Luna', desc: 'The beating heart. Restaurants, bars, nightlife, sunsets, people, energy.',
    tag: 'Party · Nightlife', tagBg: 'var(--golden-light)', tagColor: '#7A5A00',
    iconBg: 'var(--golden-light)', iconColor: '#7A5A00',
    img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&h=300&fit=crop&q=80',
  },
  {
    icon: Trees, name: 'North Siargao', desc: 'Empty beaches, raw jungle, zero crowds. The island before the island.',
    tag: 'Wild · Off-grid', tagBg: '#E8F5E9', tagColor: '#2E7D32',
    iconBg: '#E8F5E9', iconColor: '#2E7D32',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=300&fit=crop&q=80',
  },
  {
    icon: Droplets, name: 'Sugba & Islands', desc: 'Turquoise lagoons, island hopping, snorkeling, absolute calm.',
    tag: 'Lagoons · Nature', tagBg: '#E3F2FD', tagColor: '#1565C0',
    iconBg: '#E3F2FD', iconColor: '#1565C0',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=300&fit=crop&q=80',
  },
];

const CITIES = [
  { label: 'Cebu', code: 'CEB', sub: 'Mactan-Cebu Intl' },
  { label: 'Siargao', code: 'IAO', sub: 'Sayak Airport (return)' },
];

// --- DEAL CARD ---
function DealCard({ type, from, to, airline, dates, duration, price, label, urgency, timerVal, ctaText, borderColor }: any) {
  const [time, setTime] = useState(timerVal || 0);
  useEffect(() => {
    if (!timerVal) return;
    const i = setInterval(() => setTime((t: number) => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(i);
  }, []);
  const fmt = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };
  const urgencyBg = type === 'hot' ? 'var(--coral-light)' : type === 'top' ? 'var(--seafoam)' : 'var(--seafoam)';
  const urgencyColor = type === 'hot' ? 'var(--coral)' : 'var(--lagoon)';
  const timerColor = type === 'top' ? 'var(--golden)' : urgencyColor;
  const ctaBg = type === 'hot' ? 'var(--coral)' : 'var(--lagoon)';
  const priceColor = type === 'hot' ? 'var(--coral)' : 'var(--lagoon)';

  return (
    <div style={{ background: 'white', borderRadius: 12, border: `${borderColor ? '2px' : '1px'} solid ${borderColor || 'var(--border)'}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: urgencyBg, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 12, color: urgencyColor }}>{label}</span>
        {timerVal > 0 && <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 13, color: timerColor }}>{fmt(time)}</span>}
        {!timerVal && urgency && <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 12, color: urgencyColor }}>{urgency}</span>}
      </div>
      <div style={{ padding: 20, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--nightsurf)' }}>{from}</span>
          <PlaneLanding size={16} color="var(--lagoon-muted)" />
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--lagoon)' }}>{to}</span>
        </div>
        <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: 'var(--nightsurf)', marginBottom: 2 }}>✈ {airline}</p>
        <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 12, color: 'var(--lagoon-muted)', marginBottom: 16 }}>{dates} · {duration}</p>
        <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)', marginBottom: 2 }}>from</p>
        <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 24, color: priceColor, marginBottom: 2 }}>{price}</p>
        <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)' }}>one way</p>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <a href="#" target="_blank" rel="noopener noreferrer" style={{
          display: 'block', width: '100%', textAlign: 'center',
          background: ctaBg, color: 'white', border: 'none', borderRadius: 8,
          padding: '12px', fontFamily: 'Syne', fontWeight: 800, fontSize: 13,
          cursor: 'pointer', textDecoration: 'none',
        }}>{ctaText} →</a>
      </div>
    </div>
  );
}

// --- PAGE PRINCIPALE ---
export default function HomePage() {
  const router = useRouter();
  const [direction, setDirection] = useState<'to' | 'from'>('to');
  const [selectedCity, setSelectedCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pax, setPax] = useState('2 adults · Economy');

  const handleSearch = () => {
    router.push(`/flights?direction=${direction}&from=${selectedCity || 'CEB'}&depart=${departDate}&return=${returnDate}`);
  };

  return (
    <div>
      {/* HERO */}
      <section style={{ background: 'var(--nightsurf)', padding: '64px 40px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          {/* Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
            {[
              { bg: 'var(--seafoam)', color: 'var(--lagoon)', border: 'rgba(10,92,84,0.25)', text: '🌊 #1 surf island SEA' },
              { bg: 'var(--golden-light)', color: '#7A5A00', border: 'rgba(232,180,74,0.4)', text: '⚡ Exclusive Sunlight Air deals' },
              { bg: 'var(--coral-light)', color: 'var(--coral)', border: 'rgba(224,78,56,0.3)', text: '🔥 3 deals expiring tonight' },
            ].map((b, i) => (
              <span key={i} style={{ background: b.bg, color: b.color, border: `1px solid ${b.border}`, borderRadius: 20, padding: '6px 14px', fontFamily: 'Syne', fontWeight: 600, fontSize: 12 }}>
                {b.text}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 52, lineHeight: 1.1, marginBottom: 16 }}>
            <span style={{ color: 'white', display: 'block' }}>We find the deal.</span>
            <span style={{ color: 'var(--golden)', display: 'block' }}>You catch the wave.</span>
          </h1>
          <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 32, lineHeight: 1.6 }}>
            The go-to for flights to — and from — Siargao.<br />
            Compare every route, find the best price, book in seconds.
          </p>

          {/* SEARCH ENGINE */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
            {/* Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {(['to', 'from'] as const).map(d => (
                <button key={d} onClick={() => setDirection(d)} style={{
                  padding: '14px', fontFamily: 'Syne', fontWeight: 800, fontSize: 14,
                  background: direction === d ? 'var(--lagoon)' : 'var(--seafoam)',
                  color: direction === d ? 'white' : 'var(--lagoon-muted)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  {d === 'to' ? <PlaneLanding size={16} /> : <PlaneTakeoff size={16} />}
                  {d === 'to' ? 'Flying to Siargao' : 'Flying from Siargao'}
                </button>
              ))}
            </div>

            {/* Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr 1fr 1fr auto', borderTop: '1px solid var(--border)' }}>
              {/* Locked IAO */}
              <div style={{ padding: '14px 16px', background: 'var(--seafoam)', borderRight: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 10, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lock size={10} /> Destination
                </p>
                <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--lagoon)' }}>IAO</p>
                <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 10, color: 'var(--lagoon-muted)', fontStyle: 'italic' }}>Always Siargao</p>
              </div>

              {/* City */}
              <div style={{ padding: '14px 16px', borderRight: '1px solid var(--border)', position: 'relative' }}>
                <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 10, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                  {direction === 'to' ? 'Flying from' : 'Flying to'}
                </p>
                <button onClick={() => setShowCityDropdown(!showCityDropdown)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', width: '100%',
                }}>
                  <p style={{ fontFamily: 'Syne', fontWeight: selectedCity ? 800 : 400, fontSize: selectedCity ? 16 : 14, color: selectedCity ? 'var(--nightsurf)' : 'var(--lagoon-muted)' }}>
                    {selectedCity || 'Choose a city...'}
                  </p>
                  {!selectedCity && <p style={{ fontFamily: 'Syne', fontSize: 11, color: 'var(--lagoon-muted)' }}>Cebu · Siargao</p>}
                </button>
                {showCityDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border)', borderRadius: 8, zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                    {CITIES.map(c => (
                      <button key={c.code} onClick={() => { setSelectedCity(c.code); setShowCityDropdown(false); }} style={{
                        display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px',
                        background: 'none', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                        fontFamily: 'Syne', fontSize: 14, color: 'var(--nightsurf)',
                      }}>
                        <strong>{c.label}</strong> <span style={{ color: 'var(--lagoon)', fontWeight: 800 }}>({c.code})</span>
                        <br /><span style={{ fontSize: 11, color: 'var(--lagoon-muted)' }}>{c.sub}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Departure */}
              <div style={{ padding: '14px 16px', borderRight: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 10, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Departure</p>
                <input type="date" value={departDate} onChange={e => setDepartDate(e.target.value)} style={{ border: 'none', outline: 'none', fontFamily: 'Syne', fontSize: 13, color: 'var(--nightsurf)', width: '100%', background: 'transparent' }} />
              </div>

              {/* Return */}
              <div style={{ padding: '14px 16px', borderRight: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 10, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Return</p>
                <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} style={{ border: 'none', outline: 'none', fontFamily: 'Syne', fontSize: 13, color: 'var(--nightsurf)', width: '100%', background: 'transparent' }} />
              </div>

              {/* Passengers */}
              <div style={{ padding: '14px 16px', borderRight: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 10, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Passengers</p>
                <p style={{ fontFamily: 'Syne', fontSize: 13, color: 'var(--nightsurf)' }}>{pax}</p>
              </div>

              {/* Search Button */}
              <button onClick={handleSearch} style={{
                background: 'var(--coral)', color: 'white', border: 'none', cursor: 'pointer',
                padding: '0 28px', fontFamily: 'Syne', fontWeight: 800, fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Search size={16} /> SEARCH
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div style={{ background: 'var(--seafoam)', padding: '48px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>

          {/* DEALS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'var(--nightsurf)' }}>🔥 Deals right now</h2>
              <Link href="/deals" style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: 'var(--lagoon)', textDecoration: 'none' }}>See all deals →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <DealCard type="hot" from="CEB" to="IAO" airline="Sunlight Air" dates="Jun 12–19" duration="direct · 55 min" price="₱1,850" label="🔥 Deal on fire · 3 seats left" timerVal={63728} ctaText="Book before it's gone" borderColor="var(--coral)" />
              <DealCard type="top" from="CEB" to="IAO" airline="Sunlight Air" dates="Jul 5–12" duration="direct · 55 min" price="₱2,100" label="🕐 Price drops in" timerVal={22533} ctaText="Lock this price" borderColor="var(--lagoon)" />
              <DealCard type="standard" from="IAO" to="CEB" airline="Sunlight Air" dates="Jun 22" duration="direct · 55 min" price="₱1,980" label="👥 43 bookings this month" urgency="Best value" timerVal={0} ctaText="See this deal" borderColor="" />
            </div>
          </div>

          {/* ROUTES BAND */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: '24px 28px' }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 10, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>
              SUNLIGHT AIR ROUTES — SIARGAO ↔ CEBU
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ROUTES.map((r, i) => (
                <Link key={i} href={r.href} style={{
                  background: 'white', border: '1px solid var(--border)', borderRadius: 20,
                  padding: '8px 18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 14 }}>{r.icon}</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--nightsurf)' }}>{r.from} ({r.code})</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 13, color: 'var(--lagoon)' }}>{r.price}</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 12, color: 'var(--lagoon-muted)' }}>· {r.duration} · {r.type}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* PRICE ALERT */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 44, height: 44, background: 'var(--seafoam)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={20} color="var(--lagoon)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 15, color: 'var(--nightsurf)', marginBottom: 4 }}>Never miss a deal to Siargao</p>
              <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)' }}>Set your route and budget. We ping you the moment a price drops.</p>
            </div>
            <button style={{ background: 'var(--lagoon)', color: 'white', border: 'none', borderRadius: 8, padding: '12px 22px', fontFamily: 'Syne', fontWeight: 800, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              🔔 Set price alert
            </button>
          </div>

          {/* VIBES */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--nightsurf)' }}>Where are you heading?</h2>
              <Link href="/guide" style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: 'var(--lagoon)', textDecoration: 'none' }}>Full island guide →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {VIBES.map((v, i) => (
                <Link key={i} href="/guide" style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    <img src={v.img} alt={v.name} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 32, height: 32, background: v.iconBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <v.icon size={16} color={v.iconColor} />
                        </div>
                        <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: 'var(--nightsurf)' }}>{v.name}</p>
                      </div>
                      <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 12, color: 'var(--lagoon-muted)', lineHeight: 1.5, marginBottom: 10 }}>{v.desc}</p>
                      <span style={{ background: v.tagBg, color: v.tagColor, borderRadius: 20, padding: '4px 10px', fontFamily: 'Syne', fontWeight: 600, fontSize: 11 }}>{v.tag}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* GUIDE + CALENDAR */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon: BookOpen, title: 'Complete Siargao travel guide', desc: 'Best routes, cheapest months, insider tips from people who actually live here.', href: '/guide' },
              { icon: Calendar, title: 'Best time to fly — price calendar', desc: 'See the cheapest days month by month. Plan ahead, pay less.', href: '/flights' },
            ].map((card, i) => (
              <Link key={i} href={card.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--seafoam)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, display: 'flex', alignItems: 'flex-start', gap: 16, cursor: 'pointer' }}>
                  <div style={{ width: 40, height: 40, background: 'var(--lagoon)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <card.icon size={20} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 15, color: 'var(--nightsurf)', marginBottom: 6 }}>{card.title}</p>
                    <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)', lineHeight: 1.5 }}>{card.desc}</p>
                  </div>
                  <ChevronRight size={18} color="var(--lagoon)" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
