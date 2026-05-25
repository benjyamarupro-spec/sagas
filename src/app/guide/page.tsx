'use client';
import { useState, useEffect } from 'react';
import { Waves, Music, Trees, Droplets, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const TABS = [
  { id: 'overview',         label: 'Overview' },
  { id: 'how-to-get-there', label: 'How to get there' },
  { id: 'best-time',        label: 'Best time to go' },
  { id: 'island-zones',     label: 'Island zones' },
  { id: 'budget',           label: 'Budget' },
  { id: 'tips',             label: 'Tips & tricks' },
];

const ZONES = [
  { icon: Waves, name: 'Cloud 9', tag: 'Surf · Legend', tagBg: 'var(--seafoam)', tagColor: 'var(--lagoon)', iconBg: 'var(--seafoam)', iconColor: 'var(--lagoon)', img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&h=280&fit=crop&q=80', desc: 'The legendary barrel wave. World-class surf, pro competitions, pure stoke. Even non-surfers love the boardwalk sunsets.', vibe: 'For surfers, surf fans, and photographers.', best: 'October — competition month' },
  { icon: Music, name: 'General Luna', tag: 'Party · Nightlife', tagBg: 'var(--golden-light)', tagColor: '#7A5A00', iconBg: 'var(--golden-light)', iconColor: '#7A5A00', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&h=280&fit=crop&q=80', desc: 'The beating heart of Siargao. Restaurants, bars, nightlife, sunsets, digital nomads, surf schools — all in one place.', vibe: 'For those who want to be in the middle of it all.', best: 'December–March' },
  { icon: Trees, name: 'North Siargao', tag: 'Wild · Off-grid', tagBg: '#E8F5E9', tagColor: '#2E7D32', iconBg: '#E8F5E9', iconColor: '#2E7D32', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=280&fit=crop&q=80', desc: 'Empty beaches, raw jungle, zero crowds. Pacifico, Burgos — the island before the tourists arrived.', vibe: 'For adventurers who want the real thing.', best: 'Any time (always quiet)' },
  { icon: Droplets, name: 'Sugba & Islands', tag: 'Lagoons · Nature', tagBg: '#E3F2FD', tagColor: '#1565C0', iconBg: '#E3F2FD', iconColor: '#1565C0', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=280&fit=crop&q=80', desc: 'Turquoise lagoons, island hopping, snorkeling. Sugba Lagoon + the Tri-Island Tour are absolute must-dos.', vibe: 'For families, couples, and nature lovers.', best: 'March–May (calm seas)' },
];

const MONTHS = [
  { m:'Jan', w:'☀️', crowd:'High',     price:3200, stars:4 },
  { m:'Feb', w:'☀️', crowd:'Medium',   price:2800, stars:5 },
  { m:'Mar', w:'☀️', crowd:'Medium',   price:2600, stars:5 },
  { m:'Apr', w:'☀️', crowd:'Low',      price:2400, stars:4 },
  { m:'May', w:'🌤', crowd:'Low',      price:2200, stars:3 },
  { m:'Jun', w:'🌧', crowd:'Low',      price:1900, stars:2 },
  { m:'Jul', w:'🌧', crowd:'Low',      price:1850, stars:2 },
  { m:'Aug', w:'🌧', crowd:'Low',      price:1900, stars:2 },
  { m:'Sep', w:'⛈', crowd:'Very low', price:1800, stars:1 },
  { m:'Oct', w:'🌊', crowd:'High',     price:3500, stars:5 },
  { m:'Nov', w:'🌊', crowd:'Medium',   price:2900, stars:4 },
  { m:'Dec', w:'☀️', crowd:'Very high',price:4200, stars:3 },
];

const TIPS = [
  { icon:'🔔', text:'Set a price alert — Siargao deals drop fast and disappear in hours' },
  { icon:'✈️', text:'Book Sunlight Air at least 3 weeks ahead — the most popular carrier, fills fast' },
  { icon:'🌊', text:'October = surf competition month. Book 2–3 months early, prices spike' },
  { icon:'🛵', text:'Rent a motorbike on the island — it\'s the best way to explore beyond General Luna' },
  { icon:'📅', text:'Low season (Jun–Aug) has the cheapest flights but expect rain in the afternoons' },
  { icon:'💸', text:'Roundtrip is usually cheaper than two one-ways. Always check both' },
];

const BUDGETS = [
  { emoji:'🎒', tier:'Backpacker', range:'₱1,500–2,500/day', items:['Flights from ₱1,850 (Cebu direct)','Hostel dorm ₱400–700/night','Local eateries ₱150–300/meal','Motorbike rental ₱400–600/day'] },
  { emoji:'🏄', tier:'Mid-range', range:'₱3,000–6,000/day', items:['Flights from ₱2,100','Guesthouse ₱1,500–3,000/night','Mix of local & tourist restaurants','Surf lessons ₱600–1,200'] },
  { emoji:'🌴', tier:'Comfort', range:'₱8,000+/day', items:['Flights RT ₱4,000–6,000','Boutique resort ₱4,000–10,000/night','Private island tours','Yoga retreats & spa'] },
];

function getMonthBg(stars: number) {
  if (stars === 5) return { bg: '#E8F5E9', border: '#A5D6A7' };
  if (stars === 4) return { bg: 'var(--seafoam)', border: 'var(--border)' };
  if (stars === 3) return { bg: 'var(--golden-light)', border: 'rgba(232,180,74,0.4)' };
  if (stars === 2) return { bg: '#F5F5F5', border: '#E0E0E0' };
  return { bg: 'var(--coral-light)', border: 'rgba(224,78,56,0.3)' };
}

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const offsets = TABS.map(tab => {
        const el = document.getElementById(tab.id);
        if (!el) return { id: tab.id, top: Infinity };
        return { id: tab.id, top: Math.abs(el.getBoundingClientRect().top - 130) };
      });
      const closest = offsets.reduce((a, b) => a.top < b.top ? a : b);
      setActiveTab(closest.id);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{ background: 'var(--nightsurf)', padding: '56px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12, letterSpacing: 1 }}>
            BY THE SAGAS TEAM · LOCAL EXPERTS · UPDATED 2025
          </p>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 52, color: 'white', lineHeight: 1.1, marginBottom: 16 }}>
            The Complete Guide<br />to Siargao
          </h1>
          <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            Everything you need to know to get there, get around,<br />and fall in love with the island.
          </p>
        </div>
      </div>

      {/* STICKY TABS */}
      <nav style={{ position: 'sticky', top: 64, background: 'var(--nightsurf)', borderBottom: '1px solid rgba(255,255,255,0.1)', zIndex: 40, overflowX: 'auto' }}>
        <div style={{ display: 'flex', padding: '0 40px', minWidth: 'max-content' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => scrollTo(tab.id)} style={{
              background: 'transparent', border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid white' : '2px solid transparent',
              color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.5)',
              fontFamily: 'Syne', fontWeight: activeTab === tab.id ? 600 : 400, fontSize: 13,
              padding: '16px 20px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ background: 'var(--seafoam)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 40px' }}>

          {/* OVERVIEW */}
          <section id="overview" style={{ paddingTop: 56, paddingBottom: 48, scrollMarginTop: 130 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 16 }}>Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Location', value: 'Surigao del Norte, Philippines' },
                { label: 'Airport', value: 'Sayak Airport (IAO)' },
                { label: 'Best known for', value: 'Cloud 9 surf break, island life' },
                { label: 'Best months', value: 'February–April, October' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
                  <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{item.label}</p>
                  <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 16, color: 'var(--nightsurf)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* HOW TO GET THERE */}
          <section id="how-to-get-there" style={{ paddingTop: 8, paddingBottom: 48, scrollMarginTop: 130 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 8 }}>How to get there</h2>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>All routes to Siargao explained.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { from: 'From Cebu', best: 'Sunlight Air direct — 55 min — from ₱1,850', alt: 'Multiple daily departures available', tip: 'Cebu is the easiest gateway. Book Sunlight Air early for the best prices.', code: 'CEB' },
                { from: 'From Manila', best: 'Fly to Cebu first, then connect to Siargao (~4h total)', alt: 'Note: PAL moved direct MNL flights to Clark in 2025', tip: 'Via Cebu is often faster and cheaper than a direct route.', code: 'MNL' },
                { from: 'From Davao', best: 'Connect via Cebu — check availability', alt: 'Limited direct options from Davao', tip: 'Book well in advance — connections fill fast.', code: 'DVO' },
              ].map((r, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                  <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--nightsurf)', marginBottom: 8 }}>{r.from}</p>
                  <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 14, color: 'var(--lagoon)', marginBottom: 4 }}>✅ Best: {r.best}</p>
                  <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)', marginBottom: 12 }}>{r.alt}</p>
                  <div style={{ background: 'var(--seafoam)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                    <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon)' }}>💡 SAGAS tip: {r.tip}</p>
                  </div>
                  <Link href={`/flights?from=${r.code}`} style={{ background: 'var(--lagoon)', color: 'white', borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne', fontWeight: 800, fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    Search {r.from.replace('From ','')}→IAO flights <ChevronRight size={14}/>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* BEST TIME */}
          <section id="best-time" style={{ paddingTop: 8, paddingBottom: 48, scrollMarginTop: 130 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 8 }}>Best time to go</h2>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>Price and weather guide by month.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
              {MONTHS.map((mo, i) => {
                const { bg, border } = getMonthBg(mo.stars);
                return (
                  <div key={i} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: 'var(--nightsurf)' }}>{mo.m}</p>
                      <span style={{ fontSize: 16 }}>{mo.w}</span>
                    </div>
                    <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, color: 'var(--lagoon)', marginBottom: 2 }}>₱{mo.price.toLocaleString()}</p>
                    <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)' }}>{mo.crowd} crowds</p>
                    <p style={{ fontSize: 12, marginTop: 4 }}>{'⭐'.repeat(mo.stars)}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ background: 'var(--golden-light)', border: '1px solid rgba(232,180,74,0.4)', borderRadius: 12, padding: '18px 22px' }}>
              <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: '#7A5A00', lineHeight: 1.6 }}>
                💡 <strong>Best time:</strong> February to April. Reliably dry, fewer crowds, flights 30–40% cheaper than December peak.
              </p>
            </div>
          </section>

          {/* ISLAND ZONES */}
          <section id="island-zones" style={{ paddingTop: 8, paddingBottom: 48, scrollMarginTop: 130 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 8 }}>Island zones</h2>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>Siargao has distinct areas — each with its own vibe.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {ZONES.map((z, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                  <img src={z.img} alt={z.name} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 34, height: 34, background: z.iconBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <z.icon size={16} color={z.iconColor} />
                      </div>
                      <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--nightsurf)' }}>{z.name}</p>
                      <span style={{ background: z.tagBg, color: z.tagColor, borderRadius: 20, padding: '4px 10px', fontFamily: 'Syne', fontWeight: 600, fontSize: 11 }}>{z.tag}</span>
                    </div>
                    <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)', lineHeight: 1.6, marginBottom: 8 }}>{z.desc}</p>
                    <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 12, color: 'var(--lagoon)', fontStyle: 'italic', marginBottom: 4 }}>"{z.vibe}"</p>
                    <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 11, color: 'var(--lagoon-muted)' }}>Best for: {z.best}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* BUDGET */}
          <section id="budget" style={{ paddingTop: 8, paddingBottom: 48, scrollMarginTop: 130 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 8 }}>Budget guide</h2>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>What to expect at every budget level.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {BUDGETS.map((b, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                  <p style={{ fontSize: 28, marginBottom: 8 }}>{b.emoji}</p>
                  <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--nightsurf)', marginBottom: 4 }}>{b.tier}</p>
                  <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: 'var(--lagoon)', marginBottom: 16 }}>{b.range}</p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {b.items.map((item, j) => (
                      <li key={j} style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <span style={{ color: 'var(--lagoon)', fontWeight: 800, flexShrink: 0 }}>·</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* TIPS */}
          <section id="tips" style={{ paddingTop: 8, paddingBottom: 56, scrollMarginTop: 130 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 8 }}>Tips & tricks</h2>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>Insider knowledge from people who actually live here.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 40 }}>
              {TIPS.map((tip, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 20, display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{tip.icon}</span>
                  <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)', lineHeight: 1.6 }}>{tip.text}</p>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div style={{ background: 'var(--lagoon)', borderRadius: 16, padding: '40px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'white', marginBottom: 20 }}>
                Ready to book your flight to Siargao?
              </p>
              <Link href="/flights" style={{ background: 'var(--coral)', color: 'white', borderRadius: 10, padding: '16px 36px', fontFamily: 'Syne', fontWeight: 800, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
                Search flights now →
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
