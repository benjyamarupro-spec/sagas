'use client';
import { useState, useEffect, useRef } from 'react';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  minDate?: string;
  placeholder?: string;
  subLabel?: string;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function formatDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function DatePicker({ label, value, onChange, minDate, placeholder = 'Select date', subLabel }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minD = minDate ? new Date(minDate + 'T00:00:00') : today;

  const initDate = value ? new Date(value + 'T00:00:00') : (minD > today ? minD : today);
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < minD;
  };
  const isSelected = (day: number) => {
    if (!value) return false;
    return toYMD(new Date(viewYear, viewMonth, day)) === value;
  };
  const isToday = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return d.getTime() === t.getTime();
  };

  const select = (day: number) => {
    if (isDisabled(day)) return;
    onChange(toYMD(new Date(viewYear, viewMonth, day)));
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ cursor: 'pointer', padding: '14px 16px', userSelect: 'none' }}
      >
        <p style={{
          fontFamily: 'Syne', fontWeight: 400, fontSize: 10,
          color: 'var(--lagoon-muted)', textTransform: 'uppercase',
          letterSpacing: 1, margin: '0 0 4px',
        }}>
          {label}
        </p>
        <p style={{
          fontFamily: 'Syne',
          fontWeight: value ? 700 : 400,
          fontSize: 14,
          color: value ? 'var(--nightsurf)' : 'var(--lagoon-muted)',
          margin: 0,
        }}>
          {value ? formatDisplay(value) : placeholder}
        </p>
        {subLabel && (
          <p style={{ fontFamily: 'Syne', fontSize: 11, color: 'var(--lagoon)', fontWeight: 600, margin: '2px 0 0' }}>
            {subLabel}
          </p>
        )}
      </div>

      {/* Calendar dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 16,
          boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
          zIndex: 500,
          width: 300,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--lagoon)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <button
              onClick={prevMonth}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none', borderRadius: 8,
                width: 32, height: 32, cursor: 'pointer',
                color: 'white', fontSize: 16, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >‹</button>

            <p style={{
              fontFamily: 'Syne', fontWeight: 800, fontSize: 15,
              color: 'white', margin: 0,
            }}>
              {MONTHS[viewMonth]} {viewYear}
            </p>

            <button
              onClick={nextMonth}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none', borderRadius: 8,
                width: 32, height: 32, cursor: 'pointer',
                color: 'white', fontSize: 16, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >›</button>
          </div>

          {/* Day labels */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7,1fr)',
            padding: '10px 12px 4px',
            borderBottom: '1px solid var(--border)',
          }}>
            {DAYS.map(d => (
              <div key={d} style={{
                fontFamily: 'Syne', fontWeight: 600, fontSize: 10,
                color: 'var(--lagoon-muted)', textAlign: 'center',
                padding: '4px 0', textTransform: 'uppercase', letterSpacing: 0.5,
              }}>{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7,1fr)',
            padding: '8px 12px 14px', gap: 2,
          }}>
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const disabled = isDisabled(day);
              const selected = isSelected(day);
              const tod = isToday(day);

              return (
                <button
                  key={i}
                  onClick={() => select(day)}
                  disabled={disabled}
                  style={{
                    fontFamily: 'Syne',
                    fontWeight: selected ? 800 : 400,
                    fontSize: 13,
                    width: '100%',
                    aspectRatio: '1',
                    border: 'none',
                    borderRadius: 8,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    background: selected
                      ? 'var(--lagoon)'
                      : tod
                      ? 'var(--seafoam)'
                      : 'transparent',
                    color: selected
                      ? 'white'
                      : disabled
                      ? 'var(--border)'
                      : tod
                      ? 'var(--lagoon)'
                      : 'var(--nightsurf)',
                    outline: tod && !selected ? '1px solid var(--lagoon)' : 'none',
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => {
                    if (!disabled && !selected) {
                      e.currentTarget.style.background = 'var(--seafoam)';
                      e.currentTarget.style.color = 'var(--lagoon)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!disabled && !selected) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = tod ? 'var(--lagoon)' : 'var(--nightsurf)';
                    }
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          {value && (
            <div style={{
              borderTop: '1px solid var(--border)',
              padding: '10px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <p style={{ fontFamily: 'Syne', fontSize: 12, color: 'var(--lagoon)', fontWeight: 600, margin: 0 }}>
                📅 {formatDisplay(value)}
              </p>
              <button
                onClick={() => { onChange(''); setOpen(false); }}
                style={{
                  fontFamily: 'Syne', fontSize: 11, color: 'var(--lagoon-muted)',
                  background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
