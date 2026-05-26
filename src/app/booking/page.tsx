'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlaneLanding, PlaneTakeoff, Check, ChevronRight, Luggage, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useWindowSize } from '@/hooks/useWindowSize';

// ─── DONNÉES ─────────────────────────────────────────────────────

const ALL_FLIGHTS = [
  { id:1,  from:'CEB', to:'IAO', depart:'06:00', arrive:'06:55', duration:'55 min',   price:1850 },
  { id:2,  from:'CEB', to:'IAO', depart:'09:30', arrive:'10:25', duration:'55 min',   price:1980 },
  { id:3,  from:'CEB', to:'IAO', depart:'12:00', arrive:'12:55', duration:'55 min',   price:2100 },
  { id:4,  from:'CEB', to:'IAO', depart:'15:30', arrive:'16:25', duration:'55 min',   price:1920 },
  { id:5,  from:'CEB', to:'IAO', depart:'17:00', arrive:'17:55', duration:'55 min',   price:2050 },
  { id:6,  from:'IAO', to:'CEB', depart:'07:30', arrive:'08:25', duration:'55 min',   price:1850 },
  { id:7,  from:'IAO', to:'CEB', depart:'11:00', arrive:'11:55', duration:'55 min',   price:1980 },
  { id:8,  from:'IAO', to:'CEB', depart:'14:30', arrive:'15:25', duration:'55 min',   price:2100 },
  { id:9,  from:'CRK', to:'IAO', depart:'07:00', arrive:'09:30', duration:'2h 30min', price:4300 },
  { id:10, from:'CRK', to:'IAO', depart:'13:00', arrive:'15:30', duration:'2h 30min', price:4500 },
  { id:11, from:'IAO', to:'CRK', depart:'10:00', arrive:'12:30', duration:'2h 30min', price:4300 },
  { id:12, from:'IAO', to:'CRK', depart:'16:00', arrive:'18:30', duration:'2h 30min', price:4500 },
];

const BAGGAGE_OPTIONS = [
  { id:'none', label:'No checked bag',    sub:'Cabin bag only (7kg included)', price:0,   icon:'🎒' },
  { id:'20kg', label:'20 kg checked bag', sub:'Standard luggage allowance',    price:350,  icon:'🧳' },
  { id:'32kg', label:'32 kg checked bag', sub:'For longer stays',              price:600,  icon:'🧳' },
  { id:'40kg', label:'40 kg checked bag', sub:'Maximum — Sunlight Air policy', price:900,  icon:'🏋️' },
];

const SPECIAL_ASSISTANCE = [
  { id:'senior',       label:'Senior Citizen (60+)',           sub:'20% discount — OSCA ID required', icon:'👴', discount:true  },
  { id:'pwd',          label:'Person with Disability (PWD)',   sub:'20% discount — PWD ID required',  icon:'♿', discount:true  },
  { id:'wheelchair',   label:'Wheelchair assistance',          sub:'Provided at no extra cost',        icon:'🦽', discount:false },
  { id:'unaccompanied',label:'Unaccompanied Minor (8–11 yrs)', sub:'SHIS form required',              icon:'🧒', discount:false },
];

const NATIONALITIES = ['Filipino','American','Australian','British','Canadian','Chinese','French','German','Japanese','Korean','Singaporean','Spanish','Other'];

// ─── HELPERS ─────────────────────────────────────────────────────

function fmt(n: number) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

function formatDate(d: string) {
  if (!d) return '';
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
}

// ─── STEP INDICATOR ──────────────────────────────────────────────

function StepIndicator({ current, isRoundTrip, isMobile }: { current:number; isRoundTrip:boolean; isMobile:boolean }) {
  const steps = isRoundTrip
    ? ['Return flight','Add-ons','Passengers','Review']
    : ['Add-ons','Passengers','Review'];

  return (
    <div style={{ display:'flex', alignItems:'center', marginBottom: isMobile ? 20 : 32 }}>
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === current;
        const done = num < current;
        const circleSize = isMobile ? 28 : 34;
        return (
          <div key={i} style={{ display:'flex', alignItems:'center', flex: i < steps.length-1 ? 1 : 'none' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: isMobile ? 2 : 4 }}>
              <div style={{
                width:circleSize, height:circleSize, borderRadius:'50%',
                background: done||active ? 'var(--lagoon)' : 'var(--seafoam)',
                border:`2px solid ${done||active ? 'var(--lagoon)' : 'var(--border)'}`,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}>
                {done
                  ? <Check size={isMobile ? 12 : 14} color="white"/>
                  : <span style={{ fontFamily:'Syne', fontWeight:800, fontSize: isMobile ? 11 : 13, color:active?'white':'var(--lagoon-muted)' }}>{num}</span>
                }
              </div>
              <span style={{ fontFamily:'Syne', fontWeight:active?600:400, fontSize: isMobile ? 9 : 11, color:active?'var(--lagoon)':'var(--lagoon-muted)', whiteSpace:'nowrap' }}>
                {isMobile ? label.split(' ')[0] : label}
              </span>
            </div>
            {i < steps.length-1 && (
              <div style={{ flex:1, height:2, background:done?'var(--lagoon)':'var(--border)', margin:'0 4px', marginBottom: isMobile ? 14 : 18 }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MINI FLIGHT CARD ─────────────────────────────────────────────

function MiniFlightCard({ label, from, to, depart, arrive, duration, price, date }: any) {
  return (
    <div style={{ background:'white', border:'2px solid var(--lagoon)', borderRadius:12, padding:'16px 20px', marginBottom:12 }}>
      <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:10, color:'var(--lagoon-muted)', textTransform:'uppercase', letterSpacing:1, margin:'0 0 8px' }}>{label}</p>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div>
            <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:20, color:'var(--nightsurf)', margin:0 }}>{depart}</p>
            <p style={{ fontFamily:'Syne', fontWeight:600, fontSize:12, color:'var(--lagoon)', margin:0 }}>{from}</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
            <PlaneLanding size={14} color="var(--lagoon-muted)"/>
            <span style={{ fontFamily:'Syne', fontSize:10, color:'var(--lagoon-muted)' }}>{duration}</span>
          </div>
          <div>
            <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:20, color:'var(--nightsurf)', margin:0 }}>{arrive}</p>
            <p style={{ fontFamily:'Syne', fontWeight:600, fontSize:12, color:'var(--lagoon)', margin:0 }}>{to}</p>
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          {date && <p style={{ fontFamily:'Syne', fontSize:11, color:'var(--lagoon-muted)', margin:'0 0 2px' }}>📅 {formatDate(date)}</p>}
          <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:18, color:'var(--lagoon)', margin:0 }}>₱{fmt(price)}</p>
          <p style={{ fontFamily:'Syne', fontSize:11, color:'var(--lagoon-muted)', margin:0 }}>✈ Sunlight Air · Direct</p>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 0 : SELECT RETURN FLIGHT ───────────────────────────────

function StepSelectReturn({ outbound, returnDate, onSelect }: any) {
  const returnFrom = outbound.to;
  const returnTo = outbound.from;
  const options = ALL_FLIGHTS.filter(f => f.from === returnFrom && f.to === returnTo);

  return (
    <div>
      <MiniFlightCard
        label="✈ Outbound flight"
        from={outbound.from} to={outbound.to}
        depart={outbound.depart} arrive={outbound.arrive}
        duration={outbound.duration} price={outbound.price}
        date={outbound.departDate}
      />

      <h2 style={{ fontFamily:'Syne', fontWeight:800, fontSize:22, color:'var(--nightsurf)', margin:'24px 0 6px' }}>Select your return flight</h2>
      <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:14, color:'var(--lagoon-muted)', marginBottom:20 }}>
        {returnFrom} → {returnTo} · {returnDate ? formatDate(returnDate) : 'Return date'}
      </p>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {options.map(f => (
          <button
            key={f.id}
            onClick={() => onSelect(f)}
            style={{
              background:'white', border:'1px solid var(--border)', borderRadius:12,
              padding:'18px 20px', cursor:'pointer', textAlign:'left',
              transition:'all 0.15s', width:'100%',
            }}
            onMouseEnter={e => { e.currentTarget.style.border='2px solid var(--lagoon)'; e.currentTarget.style.background='var(--seafoam)'; }}
            onMouseLeave={e => { e.currentTarget.style.border='1px solid var(--border)'; e.currentTarget.style.background='white'; }}
          >
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, background:'var(--seafoam)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:12, color:'var(--lagoon)' }}>SA</span>
                </div>
                <div>
                  <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:12, color:'var(--lagoon-muted)', margin:'0 0 4px' }}>
                    Sunlight Air · Direct · {f.duration}
                  </p>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:20, color:'var(--nightsurf)' }}>{f.depart}</span>
                    <span style={{ color:'var(--lagoon-muted)' }}>→</span>
                    <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:20, color:'var(--nightsurf)' }}>{f.arrive}</span>
                    <span style={{ fontFamily:'Syne', fontSize:12, color:'var(--lagoon-muted)' }}>{f.from} → {f.to}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:11, color:'var(--lagoon-muted)', margin:'0 0 2px' }}>from</p>
                <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:22, color:'var(--lagoon)', margin:0 }}>₱{fmt(f.price)}</p>
                <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:11, color:'var(--coral)', margin:0 }}>Select →</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── STEP ADD-ONS ────────────────────────────────────────────────

function StepAddOns({ baggage, setBaggage, assistance, setAssistance, onNext, onBack, isRoundTrip }: any) {
  return (
    <div>
      <h2 style={{ fontFamily:'Syne', fontWeight:800, fontSize:22, color:'var(--nightsurf)', marginBottom:6 }}>Customize your flight</h2>
      <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:14, color:'var(--lagoon-muted)', marginBottom:24 }}>
        Add-ons apply to {isRoundTrip ? 'both flights' : 'your flight'}.
      </p>

      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <Luggage size={18} color="var(--lagoon)"/>
          <h3 style={{ fontFamily:'Syne', fontWeight:800, fontSize:16, color:'var(--nightsurf)', margin:0 }}>Checked baggage</h3>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {BAGGAGE_OPTIONS.map(opt => (
            <button key={opt.id} onClick={() => setBaggage(opt.id)} style={{
              background: baggage===opt.id ? 'var(--seafoam)' : 'white',
              border: `${baggage===opt.id?'2':'1'}px solid ${baggage===opt.id?'var(--lagoon)':'var(--border)'}`,
              borderRadius:10, padding:'14px 16px', textAlign:'left', cursor:'pointer',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                <span style={{ fontSize:20 }}>{opt.icon}</span>
                <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:14, color:opt.price===0?'var(--lagoon-muted)':'var(--lagoon)' }}>
                  {opt.price===0 ? 'Included' : `+₱${fmt(opt.price)}`}
                </span>
              </div>
              <p style={{ fontFamily:'Syne', fontWeight:700, fontSize:13, color:'var(--nightsurf)', margin:'0 0 2px' }}>{opt.label}</p>
              <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:11, color:'var(--lagoon-muted)', margin:0 }}>{opt.sub}</p>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <Users size={18} color="var(--lagoon)"/>
          <h3 style={{ fontFamily:'Syne', fontWeight:800, fontSize:16, color:'var(--nightsurf)', margin:0 }}>Special assistance</h3>
          <span style={{ fontFamily:'Syne', fontSize:12, color:'var(--lagoon-muted)' }}>(optional)</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {SPECIAL_ASSISTANCE.map(opt => (
            <button key={opt.id} onClick={() => setAssistance(assistance===opt.id?'':opt.id)} style={{
              background: assistance===opt.id ? 'var(--seafoam)' : 'white',
              border: `${assistance===opt.id?'2':'1'}px solid ${assistance===opt.id?'var(--lagoon)':'var(--border)'}`,
              borderRadius:10, padding:'12px 16px',
              display:'flex', alignItems:'center', gap:14,
              textAlign:'left', cursor:'pointer',
            }}>
              <span style={{ fontSize:22, flexShrink:0 }}>{opt.icon}</span>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:'Syne', fontWeight:700, fontSize:14, color:'var(--nightsurf)', margin:'0 0 2px' }}>{opt.label}</p>
                <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:12, color:'var(--lagoon-muted)', margin:0 }}>{opt.sub}</p>
              </div>
              {opt.discount && (
                <span style={{ background:'var(--golden-light)', color:'#7A5A00', borderRadius:20, padding:'3px 10px', fontFamily:'Syne', fontWeight:800, fontSize:11, flexShrink:0 }}>
                  20% OFF
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:12 }}>
        <button onClick={onBack} style={{ background:'white', color:'var(--lagoon)', border:'2px solid var(--lagoon)', borderRadius:10, padding:'14px', fontFamily:'Syne', fontWeight:800, fontSize:14, cursor:'pointer' }}>
          ← Back
        </button>
        <button onClick={onNext} style={{ background:'var(--coral)', color:'white', border:'none', borderRadius:10, padding:'14px', fontFamily:'Syne', fontWeight:800, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          Continue to passengers <ChevronRight size={18}/>
        </button>
      </div>
    </div>
  );
}

// ─── STEP PASSENGERS ─────────────────────────────────────────────

function StepPassengers({ passengers, setPassengers, onNext, onBack, isMobile }: any) {
  const update = (i: number, field: string, val: string) => {
    const updated = [...passengers];
    updated[i] = { ...updated[i], [field]: val };
    setPassengers(updated);
  };
  const isValid = passengers.every((p: any) => p.firstName && p.lastName && p.gender && p.dob && p.nationality && p.email && p.phone);

  const inputStyle = { width:'100%', padding:'10px 14px', border:'1px solid var(--border)', borderRadius:8, fontFamily:'Syne', fontSize:14, color:'var(--nightsurf)', background:'white', outline:'none', boxSizing:'border-box' as const };
  const labelStyle = { fontFamily:'Syne', fontWeight:600, fontSize:11, color:'var(--lagoon-muted)', textTransform:'uppercase' as const, letterSpacing:1, display:'block', marginBottom:6 };

  return (
    <div>
      <h2 style={{ fontFamily:'Syne', fontWeight:800, fontSize:22, color:'var(--nightsurf)', marginBottom:6 }}>Passenger details</h2>
      <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:14, color:'var(--lagoon-muted)', marginBottom:16 }}>Enter details exactly as on your government-issued ID.</p>

      <div style={{ background:'var(--golden-light)', border:'1px solid rgba(232,180,74,0.4)', borderRadius:10, padding:'12px 16px', display:'flex', gap:10, marginBottom:20 }}>
        <AlertCircle size={16} color="#7A5A00" style={{ flexShrink:0, marginTop:2 }}/>
        <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:13, color:'#7A5A00', margin:0 }}>
          Name must match your government-issued ID. Cannot be changed after booking.
        </p>
      </div>

      {passengers.map((pax: any, i: number) => (
        <div key={i} style={{ background:'white', border:'1px solid var(--border)', borderRadius:12, padding: isMobile ? 16 : 24, marginBottom:14 }}>
          <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:16, color:'var(--lagoon)', marginBottom:16 }}>
            Passenger {i+1}{passengers.length > 1 ? ` of ${passengers.length}` : ''}
          </p>
          {/* First + Last name: always 2 cols */}
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:12, marginBottom:12 }}>
            <div><label style={labelStyle}>First name *</label><input style={inputStyle} placeholder="As on your ID" value={pax.firstName} onChange={e=>update(i,'firstName',e.target.value)}/></div>
            <div><label style={labelStyle}>Last name *</label><input style={inputStyle} placeholder="As on your ID" value={pax.lastName} onChange={e=>update(i,'lastName',e.target.value)}/></div>
          </div>
          {/* Gender + DOB + Nationality: 1 col on mobile */}
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:12, marginBottom:12 }}>
            <div>
              <label style={labelStyle}>Gender *</label>
              <select style={inputStyle} value={pax.gender} onChange={e=>update(i,'gender',e.target.value)}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div><label style={labelStyle}>Date of birth *</label><input style={inputStyle} type="date" value={pax.dob} onChange={e=>update(i,'dob',e.target.value)}/></div>
            <div>
              <label style={labelStyle}>Nationality *</label>
              <select style={inputStyle} value={pax.nationality} onChange={e=>update(i,'nationality',e.target.value)}>
                <option value="">Select</option>
                {NATIONALITIES.map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          {/* Email + Phone: 1 col on mobile */}
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:12 }}>
            <div><label style={labelStyle}>Email *</label><input style={inputStyle} type="email" placeholder="Confirmation sent here" value={pax.email} onChange={e=>update(i,'email',e.target.value)}/></div>
            <div><label style={labelStyle}>Mobile *</label><input style={inputStyle} type="tel" placeholder="+63 XXX XXX XXXX" value={pax.phone} onChange={e=>update(i,'phone',e.target.value)}/></div>
          </div>
        </div>
      ))}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:12, marginTop:8 }}>
        <button onClick={onBack} style={{ background:'white', color:'var(--lagoon)', border:'2px solid var(--lagoon)', borderRadius:10, padding:'14px', fontFamily:'Syne', fontWeight:800, fontSize:14, cursor:'pointer' }}>← Back</button>
        <button onClick={onNext} disabled={!isValid} style={{ background:isValid?'var(--coral)':'var(--border)', color:'white', border:'none', borderRadius:10, padding:'14px', fontFamily:'Syne', fontWeight:800, fontSize:15, cursor:isValid?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          Review booking <ChevronRight size={18}/>
        </button>
      </div>
    </div>
  );
}

// ─── STEP REVIEW ────────────────────────────────────────────────

function StepReview({ passengers, baggage, assistance, outbound, returnFlight, onBack, onConfirm, isMobile }: any) {
  const baggageOpt = BAGGAGE_OPTIONS.find(b=>b.id===baggage);
  const assistanceOpt = SPECIAL_ASSISTANCE.find(a=>a.id===assistance);
  const flights = returnFlight ? [outbound, returnFlight] : [outbound];
  const baseTotal = flights.reduce((sum:number, f:any) => sum + f.price, 0);
  const baggageTotal = (baggageOpt?.price||0) * (returnFlight ? 2 : 1);
  const total = (baseTotal + baggageTotal) * passengers.length;

  return (
    <div>
      <h2 style={{ fontFamily:'Syne', fontWeight:800, fontSize:22, color:'var(--nightsurf)', marginBottom:6 }}>Review your booking</h2>
      <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:14, color:'var(--lagoon-muted)', marginBottom:20 }}>Check everything before confirming.</p>

      {/* Flights */}
      <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:12, padding:20, marginBottom:14 }}>
        <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:12, color:'var(--lagoon-muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>
          {returnFlight ? '✈ Round trip — 2 flights' : '✈ One way'}
        </p>
        {flights.map((f:any, i:number) => (
          <div key={i} style={{ padding:'10px 0', borderTop: i>0?'1px solid var(--border)':undefined }}>
            <p style={{ fontFamily:'Syne', fontSize:11, color:'var(--lagoon-muted)', margin:'0 0 6px' }}>
              {i===0 ? 'Outbound' : 'Return'} · {f.departDate ? formatDate(f.departDate) : ''}
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:18, color:'var(--nightsurf)' }}>{f.depart}</span>
              <span style={{ fontFamily:'Syne', fontWeight:600, fontSize:12, color:'var(--lagoon)' }}>{f.from}</span>
              <PlaneLanding size={14} color="var(--lagoon-muted)"/>
              <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:18, color:'var(--nightsurf)' }}>{f.arrive}</span>
              <span style={{ fontFamily:'Syne', fontWeight:600, fontSize:12, color:'var(--lagoon)' }}>{f.to}</span>
              <span style={{ fontFamily:'Syne', fontSize:11, color:'var(--lagoon-muted)', marginLeft:4 }}>· {f.duration}</span>
              <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:14, color:'var(--lagoon)', marginLeft:'auto' }}>₱{fmt(f.price)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Passengers */}
      {passengers.map((p:any, i:number) => (
        <div key={i} style={{ background:'white', border:'1px solid var(--border)', borderRadius:12, padding:20, marginBottom:14 }}>
          <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:12, color:'var(--lagoon-muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Passenger {i+1}</p>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap:12 }}>
            {[['Name',`${p.firstName} ${p.lastName}`],['Gender',p.gender],['DOB',p.dob],['Nationality',p.nationality],['Email',p.email],['Phone',p.phone]].map(([l,v])=>(
              <div key={l}><p style={{ fontFamily:'Syne', fontSize:10, color:'var(--lagoon-muted)', margin:'0 0 2px', textTransform:'uppercase', letterSpacing:0.5 }}>{l}</p><p style={{ fontFamily:'Syne', fontWeight:600, fontSize:13, color:'var(--nightsurf)', margin:0, wordBreak:'break-all' }}>{v}</p></div>
            ))}
          </div>
        </div>
      ))}

      {/* Add-ons + Price */}
      <div style={{ background:'var(--seafoam)', border:'1px solid var(--border)', borderRadius:12, padding:20, marginBottom:20 }}>
        <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:12, color:'var(--lagoon-muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Price breakdown</p>
        {[
          [`Base fare${returnFlight?' (2 flights)':''} × ${passengers.length} pax`, `₱${fmt(baseTotal*passengers.length)}`],
          [`Baggage${returnFlight?' (2 flights)':''} × ${passengers.length} pax`, baggageTotal>0?`+₱${fmt(baggageTotal*passengers.length)}`:'Included'],
          ...(assistanceOpt ? [[assistanceOpt.label, assistanceOpt.discount?'20% OFF':'']] : []),
        ].map(([l,v])=>(
          <div key={l} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <p style={{ fontFamily:'Syne', fontSize:13, color:'var(--nightsurf)', margin:0 }}>{l}</p>
            <p style={{ fontFamily:'Syne', fontWeight:600, fontSize:13, color:'var(--lagoon)', margin:0 }}>{v}</p>
          </div>
        ))}
        <div style={{ borderTop:'1px solid var(--border)', paddingTop:12, marginTop:8, display:'flex', justifyContent:'space-between' }}>
          <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:16, color:'var(--nightsurf)', margin:0 }}>Total</p>
          <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:24, color:'var(--lagoon)', margin:0 }}>₱{fmt(total)}</p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:12 }}>
        <button onClick={onBack} style={{ background:'white', color:'var(--lagoon)', border:'2px solid var(--lagoon)', borderRadius:10, padding:'14px', fontFamily:'Syne', fontWeight:800, fontSize:14, cursor:'pointer' }}>← Back</button>
        <button onClick={onConfirm} style={{ background:'var(--coral)', color:'white', border:'none', borderRadius:10, padding:'14px', fontFamily:'Syne', fontWeight:800, fontSize:15, cursor:'pointer' }}>
          Confirm booking →
        </button>
      </div>
    </div>
  );
}

// ─── CONFIRMATION ────────────────────────────────────────────────

function StepConfirmation({ passengers, outbound, returnFlight, baggage, total }: any) {
  const ref = `SAG-${Math.random().toString(36).substring(2,8).toUpperCase()}`;
  const baggageOpt = BAGGAGE_OPTIONS.find(b=>b.id===baggage);

  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ width:72, height:72, background:'var(--seafoam)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
        <Check size={36} color="var(--lagoon)"/>
      </div>
      <h2 style={{ fontFamily:'Syne', fontWeight:800, fontSize:28, color:'var(--nightsurf)', marginBottom:8 }}>Booking request received!</h2>
      <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:16, color:'var(--lagoon-muted)', marginBottom:28 }}>
        Confirmation sent to <strong>{passengers[0].email}</strong>.<br/>Our team will process your booking within 24 hours.
      </p>

      <div style={{ background:'var(--seafoam)', border:'2px solid var(--lagoon)', borderRadius:16, padding:28, marginBottom:20, textAlign:'left' }}>
        <p style={{ fontFamily:'Syne', fontSize:11, color:'var(--lagoon-muted)', textTransform:'uppercase', letterSpacing:1, margin:'0 0 6px' }}>Booking reference</p>
        <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:32, color:'var(--lagoon)', letterSpacing:4, margin:'0 0 20px' }}>{ref}</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {[
            ['Outbound', `${outbound.from} → ${outbound.to} · ${outbound.depart}`],
            ...(returnFlight ? [['Return', `${returnFlight.from} → ${returnFlight.to} · ${returnFlight.depart}`]] : []),
            ['Passenger', `${passengers[0].firstName} ${passengers[0].lastName}`],
            ['Baggage', baggageOpt?.label||''],
            ['Total', `₱${fmt(total)}`],
          ].map(([l,v])=>(
            <div key={l}><p style={{ fontFamily:'Syne', fontSize:10, color:'var(--lagoon-muted)', margin:'0 0 3px', textTransform:'uppercase', letterSpacing:0.5 }}>{l}</p><p style={{ fontFamily:'Syne', fontWeight:700, fontSize:13, color:'var(--nightsurf)', margin:0 }}>{v}</p></div>
          ))}
        </div>
      </div>

      <div style={{ background:'var(--golden-light)', border:'1px solid rgba(232,180,74,0.4)', borderRadius:10, padding:'14px 18px', marginBottom:24, textAlign:'left' }}>
        <p style={{ fontFamily:'Syne', fontSize:13, color:'#7A5A00', margin:0 }}>
          💡 Bring a valid government-issued ID matching this booking name. Online check-in: <strong>res.sunlightair.ph</strong> (opens 48h before departure)
        </p>
      </div>

      <Link href="/flights" style={{ background:'var(--lagoon)', color:'white', borderRadius:10, padding:'14px 32px', fontFamily:'Syne', fontWeight:800, fontSize:14, textDecoration:'none', display:'inline-block' }}>
        ← Back to flights
      </Link>
    </div>
  );
}

// ─── PAGE PRINCIPALE ─────────────────────────────────────────────

function BookingContent() {
  const params = useSearchParams();
  const from     = params.get('from')     || 'CEB';
  const to       = params.get('to')       || 'IAO';
  const depart   = params.get('depart')   || '06:00';
  const arrive   = params.get('arrive')   || '06:55';
  const duration = params.get('duration') || '55 min';
  const price    = params.get('price')    || '1850';
  const departDate = params.get('departDate') || '';
  const returnDate = params.get('returnDate') || params.get('return') || '';

  const isRoundTrip = !!returnDate;
  const outbound = { from, to, depart, arrive, duration, price: parseInt(price), departDate };

  const [step, setStep]             = useState(isRoundTrip ? 1 : 2);
  const [returnFlight, setReturn]   = useState<any>(null);
  const [baggage, setBaggage]       = useState('none');
  const [assistance, setAssistance] = useState('');
  const [passengers, setPassengers] = useState([
    { firstName:'', lastName:'', gender:'', dob:'', nationality:'', email:'', phone:'' }
  ]);

  const width = useWindowSize();
  const isMobile = width > 0 && width < 768;

  const baggagePrice = BAGGAGE_OPTIONS.find(b=>b.id===baggage)?.price || 0;
  const flights = returnFlight ? [outbound, returnFlight] : [outbound];
  const total = (flights.reduce((s:number,f:any)=>s+f.price,0) + baggagePrice*(returnFlight?2:1)) * passengers.length;

  const stepLabel = isRoundTrip ? step : step - 1;

  if (step === 5) {
    return (
      <div style={{ background:'var(--seafoam)', minHeight:'100vh', padding: isMobile ? '28px 16px' : '48px 40px' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <StepConfirmation passengers={passengers} outbound={outbound} returnFlight={returnFlight} baggage={baggage} total={total}/>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background:'var(--nightsurf)', padding: isMobile ? '24px 20px 32px' : '32px 40px 40px' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <Link href="/flights" style={{ fontFamily:'Syne', fontSize:12, color:'rgba(255,255,255,0.4)', textDecoration:'none', display:'inline-block', marginBottom:12 }}>
            ← Back to flights
          </Link>
          <h1 style={{ fontFamily:'Syne', fontWeight:800, fontSize: isMobile ? 24 : 32, color:'white', marginBottom:4 }}>
            {isRoundTrip ? 'Round trip booking' : 'One way booking'}
          </h1>
          <p style={{ fontFamily:'Syne', fontWeight:400, fontSize:14, color:'rgba(255,255,255,0.5)' }}>
            ✈ Sunlight Air · {from} ↔ {to} · Direct{isRoundTrip && ' · Round trip'}
          </p>
        </div>
      </div>

      <div style={{ background:'var(--seafoam)', padding: isMobile ? '24px 16px 40px' : '40px 40px 56px', minHeight:'60vh' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <StepIndicator current={stepLabel} isRoundTrip={isRoundTrip} isMobile={isMobile}/>

          {step >= 2 && (
            <div style={{ marginBottom:20 }}>
              <MiniFlightCard label="✈ Outbound" from={outbound.from} to={outbound.to} depart={outbound.depart} arrive={outbound.arrive} duration={outbound.duration} price={outbound.price} date={outbound.departDate}/>
              {returnFlight && <MiniFlightCard label="↩ Return" from={returnFlight.from} to={returnFlight.to} depart={returnFlight.depart} arrive={returnFlight.arrive} duration={returnFlight.duration} price={returnFlight.price} date={returnDate}/>}
            </div>
          )}

          {step === 1 && (
            <StepSelectReturn
              outbound={outbound}
              returnDate={returnDate}
              onSelect={(f:any) => { setReturn({...f, departDate:returnDate}); setStep(2); }}
            />
          )}
          {step === 2 && <StepAddOns baggage={baggage} setBaggage={setBaggage} assistance={assistance} setAssistance={setAssistance} isRoundTrip={isRoundTrip} onNext={()=>setStep(3)} onBack={()=>setStep(isRoundTrip?1:2)}/>}
          {step === 3 && <StepPassengers passengers={passengers} setPassengers={setPassengers} onNext={()=>setStep(4)} onBack={()=>setStep(2)} isMobile={isMobile}/>}
          {step === 4 && <StepReview passengers={passengers} baggage={baggage} assistance={assistance} outbound={outbound} returnFlight={returnFlight} onBack={()=>setStep(3)} onConfirm={()=>setStep(5)} isMobile={isMobile}/>}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{padding:40,fontFamily:'Syne'}}>Loading...</div>}>
      <BookingContent/>
    </Suspense>
  );
}
