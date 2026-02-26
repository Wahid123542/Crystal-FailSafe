import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import Navbar from '../components/Navbar';

const weekData = [
  { name: 'Mon', tickets: 12, resolved: 10 },
  { name: 'Tue', tickets: 19, resolved: 15 },
  { name: 'Wed', tickets: 15, resolved: 14 },
  { name: 'Thu', tickets: 22, resolved: 18 },
  { name: 'Fri', tickets: 30, resolved: 25 },
  { name: 'Sat', tickets: 18, resolved: 17 },
  { name: 'Sun', tickets: 10, resolved: 9 },
];

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c'];

// KPI SVG icons
const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconSmile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
  </svg>
);
const IconBot = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
    <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
  </svg>
);
const IconAlert = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--modal-bg)', border: '1px solid var(--card-border)',
      borderRadius: 10, padding: '10px 14px', fontSize: 12, fontFamily: 'DM Sans',
      boxShadow: 'var(--shadow-lg)',
    }}>
      <p style={{ margin: '0 0 6px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '2px 0', color: p.color, fontWeight: 600 }}>
          {p.name === 'tickets' ? 'Opened' : 'Resolved'}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const kpis = [
    { label: 'Avg. Resolution Time', value: '2.4 hrs', change: '-12%', positive: true, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', Icon: IconClock },
    { label: 'Staff Satisfaction', value: '98.2%', change: '+2%', positive: true, color: '#10b981', bg: 'rgba(16,185,129,0.1)', Icon: IconSmile },
    { label: 'AI Efficiency Rate', value: '74%', change: '+5%', positive: true, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', Icon: IconBot },
    { label: 'Active Alerts', value: '3', change: 'Stable', positive: null, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', Icon: IconAlert },
  ];

  const aiLogs = [
    { text: 'AI suggested resolution for Ticket #992 (Network issue — VLAN conflict)', time: '1m ago', type: 'suggestion' },
    { text: 'Auto-categorized Ticket #995 as "Hardware / Printer"', time: '4m ago', type: 'categorize' },
    { text: 'Flagged Ticket #998 as "Urgent" based on sentiment analysis', time: '9m ago', type: 'flag' },
    { text: 'Drafted initial reply for Ticket #1001 (Password reset)', time: '14m ago', type: 'draft' },
  ];

  const logColors = { suggestion: '#3b82f6', categorize: '#8b5cf6', flag: '#f43f5e', draft: '#10b981' };
  const logIcons = {
    suggestion: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    categorize: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    flag: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
    draft: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Navbar />

      <div className="animate-fade-in" style={{ padding: '32px 24px', maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', fontFamily: 'Syne', letterSpacing: '-0.02em' }}>
            System Insights
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>Real-time performance metrics · Crystal FailSafe</p>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18, marginBottom: 32 }}>
          {kpis.map((stat, i) => (
            <div key={i} className="glass-card stat-card animate-fade-in-up" style={{
              padding: '22px', borderRadius: 16,
              '--accent-color': stat.color,
              animationDelay: `${i * 0.08}s`,
              opacity: 0,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {stat.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 }}>
                    <h3 style={{ fontSize: 26, margin: 0, color: 'var(--text-primary)', fontFamily: 'Syne', fontWeight: 800 }}>{stat.value}</h3>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: stat.positive === true ? '#10b981' : stat.positive === false ? '#f43f5e' : 'var(--text-muted)',
                      background: stat.positive === true ? 'rgba(16,185,129,0.1)' : stat.positive === false ? 'rgba(244,63,94,0.1)' : 'var(--card-bg)',
                      padding: '2px 7px', borderRadius: 20,
                    }}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div style={{ width: 42, height: 42, background: stat.bg, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                  <stat.Icon />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Area chart */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h4 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: 'Syne', fontWeight: 700, fontSize: 15 }}>
                Ticket Traffic vs. Resolution
              </h4>
              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
                  <span style={{ width: 10, height: 3, background: '#2563eb', borderRadius: 2, display: 'inline-block' }} /> Opened
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
                  <span style={{ width: 10, height: 3, background: '#10b981', borderRadius: 2, display: 'inline-block' }} /> Resolved
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={weekData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--divider)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="tickets" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTickets)" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: 20 }}>
            <h4 style={{ margin: '0 0 20px', color: 'var(--text-primary)', fontFamily: 'Syne', fontWeight: 700, fontSize: 15 }}>
              Volume by Gallery
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={[
                { name: 'North', val: 45 }, { name: 'South', val: 30 }, { name: 'Great Hall', val: 55 }, { name: 'Bridge', val: 20 }
              ]} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--divider)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--hover-bg)' }} />
                <Bar dataKey="val" radius={[6, 6, 0, 0]}>
                  {[0,1,2,3].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Decision Log */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 28, height: 28, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <IconBot />
            </div>
            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: 'Syne', fontWeight: 700, fontSize: 15 }}>AI Decision Log</h4>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#10b981', background: 'rgba(16,185,129,0.08)', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
              Live
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {aiLogs.map((log, i) => (
              <div key={i} className="animate-fade-in-up" style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                background: 'var(--card-bg)', borderRadius: 10, fontSize: 13,
                color: 'var(--text-secondary)', border: '1px solid var(--card-border)',
                animationDelay: `${i * 0.06}s`, opacity: 0,
              }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: `rgba(${logColors[log.type].slice(1).match(/.{2}/g).map(h=>parseInt(h,16)).join(',')}, 0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: logColors[log.type], flexShrink: 0 }}>
                  {logIcons[log.type]}
                </div>
                <span style={{ flex: 1 }}>{log.text}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
      `}</style>
    </div>
  );
}