'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlaneLanding, Check, ChevronRight, Luggage, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const BAGGAGE_OPTIONS = [
  { id: 'none', label: 'No checked bag', sub: 'Cabin bag only (7kg included)', price: 0, icon: '🎒' },
  { id: '20kg', label: '20 kg checked bag', sub: 'Standard luggage allowance', price: 350, icon: '🧳' },
  { id: '32kg', label: '32 kg checked bag', sub: 'For longer stays', price: 600, icon: '🧳' },
  { id: '40kg', label: '40 kg checked bag', sub: 'Maximum allowed per Sunlight Air policy', price: 900, icon: '🏋️' },
];

const SPECIAL_ASSISTANCE = [
  { id: 'senior', label: 'Senior Citizen (60+)', sub: '20% discount — OSCA ID required at check-in', icon: '👴', discount: true },
  { id: 'pwd', label: 'Person with Disability (PWD)', sub: '20% discount — PWD ID required at check-in', icon: '♿', discount: true },
  { id: 'wheelchair', label: 'Wheelchair assistance', sub: 'Airport wheelchair provided at no extra cost', icon: '🦽', discount: false },
  { id: 'unaccompanied', label: 'Unaccompanied Minor (8–11 yrs)', sub: 'Special handling — SHIS form required', icon: '🧒', discount: false },
];

const NATIONALITIES = [
  'Filipino', 'American', 'Australian', 'British', 'Canadian',
  'Chinese', 'French', 'German', 'Japanese', 'Korean',
  'Singaporean', 'Spanish', 'Other',
];

function StepIndicator({ current }: { current: number }) {
  const steps = ['Add-ons', 'Passenger details', 'Review & confirm'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === current;
        const done = num < current;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: done ? 'var(--lagoon)' : active ? 'var(--lagoon)' : 'var(--seafoam)',
                border: `2px solid ${done || active ? 'var(--lagoon)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {done
                  ? <Check size={16} color="white" />
                  : <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: active ? 'white' : 'var(--lagoon-muted)' }}>{num}</span>
                }
              </div>
              <span style={{ fontFamily: 'Syne', fontWeight: active ? 600 : 400, fontSize: 12, color: active ? 'var(--lagoon)' : 'var(--lagoon-muted)', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? 'var(--lagoon)' : 'var(--border)', margin: '0 8px', marginBottom: 20 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FlightCard({ from, to, depart, arrive, duration, price, extraCost }: any) {
  const total = (parseInt(price) + extraCost).toLocaleString();
  return (
    <div style={{ background: 'white', border: '2px solid var(--lagoon)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'var(--seafoam)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 12, color: 'var(--lagoon)' }}>SA</span>
          </div>
          <div>
            <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: 'var(--nightsurf)', margin: 0 }}>Sunlight Air</p>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)', margin: 0 }}>Direct · {duration}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)', margin: 0 }}>Total</p>
          <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'var(--lagoon)', margin: 0 }}>₱{total}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'var(--nightsurf)', margin: 0 }}>{depart}</p>
          <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: 'var(--lagoon)', margin: 0 }}>{from}</p>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <PlaneLanding size={16} color="var(--lagoon-muted)" />
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'var(--nightsurf)', margin: 0 }}>{arrive}</p>
          <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: 'var(--lagoon)', margin: 0 }}>{to}</p>
        </div>
      </div>
    </div>
  );
}

function StepAddOns({ baggage, setBaggage, assistance, setAssistance, onNext, flightProps }: any) {
  const extraCost = BAGGAGE_OPTIONS.find(b => b.id === baggage)?.price || 0;
  return (
    <div>
      <FlightCard {...flightProps} extraCost={extraCost} />

      <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'var(--nightsurf)', marginBottom: 6 }}>Customize your flight</h2>
      <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>Add what you need for a comfortable journey.</p>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Luggage size={18} color="var(--lagoon)" />
          <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--nightsurf)', margin: 0 }}>Checked baggage</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {BAGGAGE_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setBaggage(opt.id)}
              style={{
                background: baggage === opt.id ? 'var(--seafoam)' : 'white',
                border: `${baggage === opt.id ? '2px' : '1px'} solid ${baggage === opt.id ? 'var(--lagoon)' : 'var(--border)'}`,
                borderRadius: 10, padding: '14px 16px', textAlign: 'left',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 20 }}>{opt.icon}</span>
                <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: opt.price === 0 ? 'var(--lagoon-muted)' : 'var(--lagoon)' }}>
                  {opt.price === 0 ? 'Included' : `+₱${opt.price}`}
                </span>
              </div>
              <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--nightsurf)', margin: '0 0 2px' }}>{opt.label}</p>
              <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 12, color: 'var(--lagoon-muted)', margin: 0 }}>{opt.sub}</p>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Users size={18} color="var(--lagoon)" />
          <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--nightsurf)', margin: 0 }}>Special assistance</h3>
          <span style={{ fontFamily: 'Syne', fontSize: 12, color: 'var(--lagoon-muted)' }}>(optional)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SPECIAL_ASSISTANCE.map(opt => (
            <button
              key={opt.id}
              onClick={() => setAssistance(assistance === opt.id ? '' : opt.id)}
              style={{
                background: assistance === opt.id ? 'var(--seafoam)' : 'white',
                border: `${assistance === opt.id ? '2px' : '1px'} solid ${assistance === opt.id ? 'var(--lagoon)' : 'var(--border)'}`,
                borderRadius: 10, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
                textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--nightsurf)', margin: '0 0 2px' }}>{opt.label}</p>
                <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 12, color: 'var(--lagoon-muted)', margin: 0 }}>{opt.sub}</p>
              </div>
              {opt.discount && (
                <span style={{ background: 'var(--golden-light)', color: '#7A5A00', borderRadius: 20, padding: '3px 10px', fontFamily: 'Syne', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>
                  20% OFF
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        style={{ width: '100%', background: 'var(--coral)', color: 'white', border: 'none', borderRadius: 10, padding: '16px', fontFamily: 'Syne', fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        Continue to passenger details <ChevronRight size={18} />
      </button>
    </div>
  );
}

function StepPassengers({ passengers, setPassengers, onNext, onBack, paxCount }: any) {
  const updatePax = (index: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const isValid = passengers.every((p: any) =>
    p.firstName && p.lastName && p.gender && p.dob && p.nationality && p.email && p.phone
  );

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid var(--border)',
    borderRadius: 8, fontFamily: 'Syne', fontSize: 14, color: 'var(--nightsurf)',
    background: 'white', outline: 'none', boxSizing: 'border-box' as const,
  };
  const labelStyle = {
    fontFamily: 'Syne', fontWeight: 600, fontSize: 11,
    color: 'var(--lagoon-muted)', textTransform: 'uppercase' as const,
    letterSpacing: 1, display: 'block', marginBottom: 6,
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'var(--nightsurf)', marginBottom: 6 }}>Passenger details</h2>
      <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>
        Enter details exactly as they appear on your government-issued ID.
      </p>

      <div style={{ background: 'var(--golden-light)', border: '1px solid rgba(232,180,74,0.4)', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10, marginBottom: 24 }}>
        <AlertCircle size={16} color="#7A5A00" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: '#7A5A00', margin: 0 }}>
          Name must match your government-issued ID exactly. Incorrect names cannot be changed after booking.
        </p>
      </div>

      {passengers.map((pax: any, i: number) => (
        <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--lagoon)', marginBottom: 20 }}>
            Passenger {i + 1} {paxCount > 1 ? `of ${paxCount}` : ''}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>First name *</label>
              <input style={inputStyle} placeholder="As on your ID" value={pax.firstName} onChange={e => updatePax(i, 'firstName', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Last name *</label>
              <input style={inputStyle} placeholder="As on your ID" value={pax.lastName} onChange={e => updatePax(i, 'lastName', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Gender *</label>
              <select style={inputStyle} value={pax.gender} onChange={e => updatePax(i, 'gender', e.target.value)}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date of birth *</label>
              <input style={inputStyle} type="date" value={pax.dob} onChange={e => updatePax(i, 'dob', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Nationality *</label>
              <select style={inputStyle} value={pax.nationality} onChange={e => updatePax(i, 'nationality', e.target.value)}>
                <option value="">Select</option>
                {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Email address *</label>
              <input style={inputStyle} type="email" placeholder="Booking confirmation sent here" value={pax.email} onChange={e => updatePax(i, 'email', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Mobile number *</label>
              <input style={inputStyle} type="tel" placeholder="+63 XXX XXX XXXX" value={pax.phone} onChange={e => updatePax(i, 'phone', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginTop: 8 }}>
        <button onClick={onBack} style={{ background: 'white', color: 'var(--lagoon)', border: '2px solid var(--lagoon)', borderRadius: 10, padding: '14px', fontFamily: 'Syne', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          style={{ background: isValid ? 'var(--coral)' : 'var(--border)', color: 'white', border: 'none', borderRadius: 10, padding: '14px', fontFamily: 'Syne', fontWeight: 800, fontSize: 15, cursor: isValid ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          Review booking <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function StepReview({ passengers, baggage, assistance, onBack, flightProps, onConfirm }: any) {
  const baggageOpt = BAGGAGE_OPTIONS.find(b => b.id === baggage);
  const assistanceOpt = SPECIAL_ASSISTANCE.find(a => a.id === assistance);
  const basePrice = parseInt(flightProps.price);
  const baggagePrice = baggageOpt?.price || 0;
  const total = (basePrice + baggagePrice) * passengers.length;

  return (
    <div>
      <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'var(--nightsurf)', marginBottom: 6 }}>Review your booking</h2>
      <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 24 }}>Check all details before confirming.</p>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 14 }}>
        <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 13, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Flight</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--nightsurf)', margin: 0 }}>{flightProps.from}</p>
          <PlaneLanding size={16} color="var(--lagoon-muted)" />
          <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--lagoon)', margin: 0 }}>{flightProps.to}</p>
          <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)', margin: '0 0 0 8px' }}>{flightProps.depart} → {flightProps.arrive} · {flightProps.duration}</p>
        </div>
        <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: 'var(--lagoon-muted)', margin: '6px 0 0' }}>✈ Sunlight Air · Direct</p>
      </div>

      {passengers.map((p: any, i: number) => (
        <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 14 }}>
          <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 13, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Passenger {i + 1}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              ['Full name', `${p.firstName} ${p.lastName}`],
              ['Gender', p.gender.charAt(0).toUpperCase() + p.gender.slice(1)],
              ['Date of birth', p.dob],
              ['Nationality', p.nationality],
              ['Email', p.email],
              ['Phone', p.phone],
            ].map(([label, val]) => (
              <div key={label}>
                <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</p>
                <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: 'var(--nightsurf)', margin: 0 }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 14 }}>
        <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 13, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Add-ons</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: assistanceOpt ? 8 : 0 }}>
          <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 14, color: 'var(--nightsurf)', margin: 0 }}>{baggageOpt?.icon} {baggageOpt?.label}</p>
          <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 14, color: baggagePrice > 0 ? 'var(--lagoon)' : 'var(--lagoon-muted)', margin: 0 }}>
            {baggagePrice > 0 ? `+₱${baggagePrice}` : 'Included'}
          </p>
        </div>
        {assistanceOpt && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 14, color: 'var(--nightsurf)', margin: 0 }}>{assistanceOpt.icon} {assistanceOpt.label}</p>
            {assistanceOpt.discount && <span style={{ background: 'var(--golden-light)', color: '#7A5A00', borderRadius: 20, padding: '3px 10px', fontFamily: 'Syne', fontWeight: 800, fontSize: 11 }}>20% OFF applied</span>}
          </div>
        )}
      </div>

      <div style={{ background: 'var(--seafoam)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 13, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Price breakdown</p>
        {[
          [`Base fare × ${passengers.length} pax`, `₱${(basePrice * passengers.length).toLocaleString()}`],
          [`Baggage × ${passengers.length} pax`, baggagePrice > 0 ? `+₱${(baggagePrice * passengers.length).toLocaleString()}` : 'Included'],
        ].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--nightsurf)', margin: 0 }}>{label}</p>
            <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 14, color: 'var(--lagoon)', margin: 0 }}>{val}</p>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--nightsurf)', margin: 0 }}>Total</p>
          <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'var(--lagoon)', margin: 0 }}>₱{total.toLocaleString()}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'white', color: 'var(--lagoon)', border: '2px solid var(--lagoon)', borderRadius: 10, padding: '14px', fontFamily: 'Syne', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
          ← Back
        </button>
        <button
          onClick={onConfirm}
          style={{ background: 'var(--coral)', color: 'white', border: 'none', borderRadius: 10, padding: '14px', fontFamily: 'Syne', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}
        >
          Confirm booking →
        </button>
      </div>
    </div>
  );
}

function StepConfirmation({ passengers, flightProps, baggage, total }: any) {
  const ref = `SAG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const baggageOpt = BAGGAGE_OPTIONS.find(b => b.id === baggage);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, background: 'var(--seafoam)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <Check size={36} color="var(--lagoon)" />
      </div>
      <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--nightsurf)', marginBottom: 8 }}>Booking request received!</h2>
      <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 16, color: 'var(--lagoon-muted)', marginBottom: 8 }}>
        A confirmation will be sent to <strong>{passengers[0].email}</strong>
      </p>
      <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'var(--lagoon-muted)', marginBottom: 32 }}>
        Our team will process your booking and contact you within 24 hours.
      </p>

      <div style={{ background: 'var(--seafoam)', border: '2px solid var(--lagoon)', borderRadius: 16, padding: 28, marginBottom: 28, textAlign: 'left' }}>
        <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Booking reference</p>
        <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 32, color: 'var(--lagoon)', marginBottom: 20, letterSpacing: 4 }}>{ref}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['Flight', `${flightProps.from} → ${flightProps.to}`],
            ['Departure', `${flightProps.depart}`],
            ['Passenger', `${passengers[0].firstName} ${passengers[0].lastName}`],
            ['Baggage', baggageOpt?.label || ''],
            ['Total paid', `₱${total.toLocaleString()}`],
          ].map(([label, val]) => (
            <div key={label}>
              <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 11, color: 'var(--lagoon-muted)', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</p>
              <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--nightsurf)', margin: 0 }}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--golden-light)', border: '1px solid rgba(232,180,74,0.4)', borderRadius: 10, padding: '14px 18px', marginBottom: 28, textAlign: 'left' }}>
        <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 13, color: '#7A5A00', margin: 0 }}>
          💡 Please bring a valid government-issued ID that matches the name on this booking. Online check-in opens 48h before departure at <strong>res.sunlightair.ph</strong>
        </p>
      </div>

      <Link href="/flights" style={{ background: 'var(--lagoon)', color: 'white', borderRadius: 10, padding: '14px 32px', fontFamily: 'Syne', fontWeight: 800, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
        ← Back to flights
      </Link>
    </div>
  );
}

function BookingContent() {
  const params = useSearchParams();
  const from = params.get('from') || 'CEB';
  const to = params.get('to') || 'IAO';
  const depart = params.get('depart') || '06:00';
  const arrive = params.get('arrive') || '06:55';
  const duration = params.get('duration') || '55 min';
  const price = params.get('price') || '1850';

  const flightProps = { from, to, depart, arrive, duration, price };

  const [step, setStep] = useState(1);
  const [baggage, setBaggage] = useState('none');
  const [assistance, setAssistance] = useState('');
  const [passengers, setPassengers] = useState([
    { firstName: '', lastName: '', gender: '', dob: '', nationality: '', email: '', phone: '' }
  ]);

  const baggagePrice = BAGGAGE_OPTIONS.find(b => b.id === baggage)?.price || 0;
  const total = (parseInt(price) + baggagePrice) * passengers.length;

  if (step === 4) {
    return (
      <div style={{ background: 'var(--seafoam)', minHeight: '100vh', padding: '48px 40px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <StepConfirmation passengers={passengers} flightProps={flightProps} baggage={baggage} total={total} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: 'var(--nightsurf)', padding: '32px 40px 40px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <Link href="/flights" style={{ fontFamily: 'Syne', fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
            ← Back to flights
          </Link>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 32, color: 'white', marginBottom: 4 }}>Book your flight</h1>
          <p style={{ fontFamily: 'Syne', fontWeight: 400, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 0 }}>
            ✈ Sunlight Air · {from} → {to} · Direct
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--seafoam)', padding: '40px 40px 56px', minHeight: '60vh' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <StepIndicator current={step} />
          {step === 1 && <StepAddOns baggage={baggage} setBaggage={setBaggage} assistance={assistance} setAssistance={setAssistance} onNext={() => setStep(2)} flightProps={flightProps} />}
          {step === 2 && <StepPassengers passengers={passengers} setPassengers={setPassengers} onNext={() => setStep(3)} onBack={() => setStep(1)} paxCount={passengers.length} />}
          {step === 3 && <StepReview passengers={passengers} baggage={baggage} assistance={assistance} onBack={() => setStep(2)} flightProps={flightProps} onConfirm={() => setStep(4)} />}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Syne' }}>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
