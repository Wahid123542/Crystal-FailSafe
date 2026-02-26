import { useState, useRef } from 'react';

const categoryConfig = {
  hardware: { icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>), color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  software: { icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>), color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
  account: { icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>), color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
  network: { icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>), color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)' },
  access: { icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>), color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
};
const defaultCat = { icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>), color: '#8496b0', bg: 'rgba(132,150,176,0.08)', border: 'rgba(132,150,176,0.15)' };

const priorityPulse = { urgent: '#a78bfa', high: '#f43f5e', medium: '#f59e0b', low: '#10b981' };

function formatDate(d) {
  const diff = Date.now() - new Date(d);
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), day = Math.floor(diff / 86400000);
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${day}d ago`;
}

export default function TicketCard({ ticket, onClick, index = 0 }) {
  const cat = categoryConfig[ticket.category] || defaultCat;
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState([]);
  const rippleId = useRef(0);

  // 3D magnetic tilt
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -4, y: dx * 4 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  // Ripple on click
  const handleClick = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleId.current++;
    setRipples(r => [...r, { x, y, id }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    onClick();
  };

  const pulseColor = priorityPulse[ticket.priority] || '#8496b0';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 14, padding: '18px 22px', cursor: 'pointer',
        background: hovered ? 'rgba(37,99,235,0.04)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? 'rgba(37,99,235,0.3)' : 'rgba(255,255,255,0.06)'}`,
        transform: hovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-3px) scale(1.005)`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
        transition: hovered
          ? 'transform 0.1s ease, border-color 0.2s, background 0.2s, box-shadow 0.2s'
          : 'transform 0.4s cubic-bezier(0.4,0,0.2,1), border-color 0.3s, background 0.3s, box-shadow 0.3s',
        boxShadow: hovered
          ? `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(37,99,235,0.15), inset 0 1px 0 rgba(255,255,255,0.05)`
          : '0 2px 8px rgba(0,0,0,0.2)',
        animation: `cardReveal 0.5s cubic-bezier(0.4,0,0.2,1) ${index * 0.05}s both`,
        willChange: 'transform',
      }}
    >
      {/* Shine overlay on hover */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 14, pointerEvents: 'none',
        background: hovered
          ? `radial-gradient(circle at ${50 + tilt.y * 5}% ${50 + tilt.x * 5}%, rgba(255,255,255,0.04) 0%, transparent 60%)`
          : 'none',
        transition: 'background 0.15s',
      }} />

      {/* Ripple effects */}
      {ripples.map(rp => (
        <span key={rp.id} style={{
          position: 'absolute', left: rp.x, top: rp.y,
          width: 8, height: 8, marginLeft: -4, marginTop: -4,
          background: 'rgba(59,130,246,0.35)', borderRadius: '50%',
          animation: 'rippleOut 0.65s cubic-bezier(0,0.5,0.5,1) forwards',
          pointerEvents: 'none',
        }} />
      ))}

      {/* Left priority accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3,
        background: pulseColor, borderRadius: '0 3px 3px 0',
        opacity: hovered ? 1 : 0.5,
        boxShadow: hovered ? `0 0 12px ${pulseColor}` : 'none',
        transition: 'all 0.3s',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Category icon with spin-in */}
        <div style={{
          width: 42, height: 42, background: cat.bg, border: `1px solid ${cat.border}`,
          borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: cat.color,
          transform: hovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: hovered ? `0 0 16px ${cat.bg}` : 'none',
        }}>
          {cat.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#3d5068', background: 'rgba(255,255,255,0.04)', padding: '2px 7px', borderRadius: 4 }}>
              #{String(ticket.id || ticket.ticket_number).padStart(4,'0')}
            </span>
            <span className={`badge-${ticket.status}`} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {ticket.status.replace('_',' ')}
            </span>
            <span className={`priority-${ticket.priority}`} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: pulseColor, display: 'inline-block', boxShadow: `0 0 5px ${pulseColor}`, animation: ticket.priority === 'urgent' || ticket.priority === 'high' ? 'dotPulse 1.5s ease-in-out infinite' : 'none' }} />
              {ticket.priority}
            </span>
          </div>

          <h3 style={{
            margin: '0 0 5px', fontSize: 14, fontWeight: 600,
            fontFamily: 'Syne, sans-serif', color: hovered ? '#f1f5f9' : '#e2e8f0',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            transition: 'color 0.2s',
          }}>
            {ticket.subject}
          </h3>

          <p style={{ margin: '0 0 10px', fontSize: 12.5, color: '#3d5068', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {ticket.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11.5, color: '#3d5068', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              {ticket.sender || ticket.sender_email}
            </span>
            <span style={{ fontSize: 10, color: '#3d5068', background: 'rgba(255,255,255,0.03)', padding: '2px 7px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', textTransform: 'capitalize' }}>
              {ticket.category || 'general'}
            </span>
            <span style={{ fontSize: 11, color: '#3d5068', marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace' }}>
              {formatDate(ticket.created_at)}
            </span>
          </div>
        </div>

        {/* Arrow — slides on hover */}
        <div style={{
          color: hovered ? '#3b82f6' : '#3d5068', flexShrink: 0, alignSelf: 'center', display: 'flex',
          transform: hovered ? 'translateX(3px)' : 'translateX(0)',
          transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rippleOut {
          to { transform: scale(28); opacity: 0; }
        }
        @keyframes dotPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.6); }
        }
      `}</style>
    </div>
  );
}