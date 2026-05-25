'use client';
import { useState, useEffect } from 'react';
import { Bell, PlaneLanding } from 'lucide-react';

const ALL_DEALS = [
  { id:1, type:'hot', from:'CEB', to:'IAO', airline:'Sunlight Air', dates:'Jun 12–19', duration:'direct · 55 min', price:1850, label:'🔥 Deal on fire · 3 seats left', timerVal:63728, cta:'Book before it\'s gone' },
  { id:2, type:'top', from:'CEB', to:'IAO', airline:'Sunlight Air', dates:'Jul 5–12', duration:'direct · 55 min', price:2100, label:'🕐 Price drops in', timerVal:22533, cta:'Lock this price' },
  { id:3, type:'standard', from:'IAO', to:'CEB', airline:'Sunlight Air', dates:'Jun 22', duration:'direct · 55 min', price:1980, label:'👥 43 bookings this month', urgency:'Best value', timerVal:0, cta:'See this deal' },
  { id:4, type:'hot', from:'CEB', to:'IAO', airline:'Sunlight Air', dates:'Aug 3–10', duration:'direct · 55 min', price:1850, label:'🔥 Flash sale · 2 seats left', timerVal:18200, cta:'Book before it\'s gone' },
  { id:5, type:'top', from:'IAO', to:'CEB', airline:'Sunlight Air', dates:'Jul 20', duration:'direct · 55 min', price:1920, label:'🕐 Limited time offer', timerVal:31400, cta:'Lock this price' },
  { id:6, type:'standard', from:'CEB', to:'IAO', airline:'Sunlight Air', dates:'Sep 1–8', duration:'direct · 55 min', price:1850, label:'📅 Low season fare', urgency:'Best time to buy', timerVal:0, cta:'See this deal' },
];

function DealCard({ deal }: { deal: typeof ALL_DEALS[0] }) {
  const [time, setTime] = useState(deal.timerVal);
  useEffect(() => {
    if (!deal.timerVal) return;
    const i = setInterval(() => setTime(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(i);
  }, []);
  const fmt = (s: number) => {
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };
  const styles = {
    hot:      { bar:'var(--coral-light)',  barText:'var(--coral)',      timer:'var(--coral)',      border:'2px solid var(--coral)',      cta:'var(--coral)',   price:'var(--coral)' },
    top:      { bar:'var(--seafoam)',      barText:'var(--lagoon)',     timer:'var(--golden)',     border:'2px solid var(--lagoon)',     cta:'var(--lagoon)', price:'var(--lagoon)' },
    standard: { bar:'var(--seafoam)',      barText:'var(--lagoon)',     timer:'var(--lagoon)',     border:'1px solid var(--border)',     cta:'var(--lagoon)', price:'var(--lagoon)' },
  };
  const s = styles[deal.type as keyof typeof styles];
  return (
    <div style={{ background:'white', borderRadius:12, border:s.border, overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ background:s.bar, padding:'10px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontFamily:'Syne', fontWeight:600, fontSize:12, color:s.barText }}>{deal.label}</span>
        {deal.timerVal > 0
          ? <span style={{ fontFamily:'monospace', fontWeight:800, fontSize:13, color:s.timer }}>{fmt(time)}</span>
          : <span style={{ fontFamily:'Syne', fontWeight:600, fontSize:12, color:s.barText }}>{deal.urgency}</span>
        }
      </div>
      <div style={{ padding:20, flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:20, color:'var(--nightsurf)' }}>{deal.from}</span>
          <PlaneLanding size={16} color="var(--lagoon-muted)" />
          <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:20, color:'var(--lagoon)' }}>{deal.to}</span>
        </div>
        <p style={{ fontFamily:'Syne', fontWeight:600, fontSize:13, color:'var(--nightsurf)', marginBottom:2 }}>✈ {deal.airline}</p>
        <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:12, color:'var(--lagoon-muted)', marginBottom:16 }}>{deal.dates} · {deal.duration}</p>
        <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:11, color:'var(--lagoon-muted)', marginBottom:2 }}>from</p>
        <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:26, color:s.price, marginBottom:2 }}>₱{deal.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
        <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:11, color:'var(--lagoon-muted)' }}>one way</p>
      </div>
      <div style={{ padding:'0 20px 20px' }}>
        <a href="#" target="_blank" rel="noopener noreferrer" style={{ display:'block', textAlign:'center', background:s.cta, color:'white', borderRadius:8, padding:'12px', fontFamily:'Syne', fontWeight:800, fontSize:13, textDecoration:'none' }}>
          {deal.cta} →
        </a>
      </div>
    </div>
  );
}

export default function DealsPage() {
  const [filter, setFilter] = useState('all');
  const TABS = ['all','direct','under2000','expiring'];
  const TAB_LABELS: Record<string,string> = { all:'All deals', direct:'Direct flights', under2000:'Under ₱2,000', expiring:'Expiring soon' };

  const filtered = ALL_DEALS.filter(d => {
    if (filter === 'direct') return d.duration.includes('direct');
    if (filter === 'under2000') return d.price < 2000;
    if (filter === 'expiring') return d.timerVal > 0 && d.timerVal < 30000;
    return true;
  });

  const stats = [
    { label:'active deals', value:ALL_DEALS.length, color:'var(--seafoam)', textColor:'var(--lagoon)' },
    { label:'Lowest today', value:'₱1,850', color:'var(--seafoam)', textColor:'var(--lagoon)' },
    { label:'expiring tonight', value:'3', color:'var(--coral-light)', textColor:'var(--coral)' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ background:'var(--nightsurf)', padding:'48px 40px 56px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <span style={{ background:'var(--coral-light)', color:'var(--coral)', borderRadius:20, padding:'6px 14px', fontFamily:'Syne', fontWeight:600, fontSize:12 }}>🔥 Live deals</span>
          <h1 style={{ fontFamily:'Syne', fontWeight:800, fontSize:40, color:'white', margin:'16px 0 8px', lineHeight:1.1 }}>Best flight deals to Siargao right now</h1>
          <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:16, color:'rgba(255,255,255,0.5)' }}>Updated daily. We track every Sunlight Air fare so you don't have to.</p>
          <div style={{ display:'flex', gap:12, marginTop:28 }}>
            {stats.map((s,i) => (
              <div key={i} style={{ background:s.color, borderRadius:10, padding:'16px 24px' }}>
                <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:24, color:s.textColor }}>{s.value}</p>
                <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:12, color:s.textColor, opacity:0.8 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ background:'var(--seafoam)', padding:'32px 40px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          {/* Filter tabs */}
          <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{
                background: filter===t ? 'var(--lagoon)' : 'white',
                color: filter===t ? 'white' : 'var(--lagoon-muted)',
                border: `1px solid ${filter===t ? 'var(--lagoon)' : 'var(--border)'}`,
                borderRadius:20, padding:'8px 20px',
                fontFamily:'Syne', fontWeight: filter===t ? 600 : 400, fontSize:13,
                cursor:'pointer',
              }}>
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16, marginBottom:32 }}>
            {filtered.map(d => <DealCard key={d.id} deal={d} />)}
          </div>

          {/* Alert strip */}
          <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:16, padding:'24px 28px', display:'flex', alignItems:'center', gap:20 }}>
            <div style={{ width:44, height:44, background:'var(--seafoam)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Bell size={20} color="var(--lagoon)" />
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:'Syne', fontWeight:600, fontSize:15, color:'var(--nightsurf)', marginBottom:4 }}>Never miss a deal to Siargao</p>
              <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:13, color:'var(--lagoon-muted)' }}>Set your route and budget. We ping you the moment a price drops.</p>
            </div>
            <button style={{ background:'var(--lagoon)', color:'white', border:'none', borderRadius:8, padding:'12px 22px', fontFamily:'Syne', fontWeight:800, fontSize:12, cursor:'pointer', whiteSpace:'nowrap' }}>
              🔔 Set price alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
