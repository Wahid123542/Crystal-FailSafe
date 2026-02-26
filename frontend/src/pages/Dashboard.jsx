import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EmailTicketModal from '../components/EmailTicketModal';
import api from '../api';

const IconRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M3 21v-5h5"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconUnassigned = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconInProgress = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);
const IconResolved = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconSparkles = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

const categoryColors = {
  hardware: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  network:  { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',  border: 'rgba(6,182,212,0.2)' },
  software: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
  account:  { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
  access:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  other:    { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)' },
};

const priorityColor = { urgent: '#a78bfa', high: '#f43f5e', medium: '#f59e0b', low: '#10b981' };

// Generate initials + color from name
const staffColor = (id) => ['#2563eb','#7c3aed','#059669','#db2777','#d97706','#0891b2'][id % 6];
const initials = (name) => name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) : '??';

function formatTime(d) {
  const diff = Date.now() - new Date(d);
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const dy = Math.floor(diff / 86400000);
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${dy}d ago`;
}

// Normalize ticket from backend to match our UI format
const normalizeTicket = (t) => ({
  id: t.id,
  ticket_number: t.ticket_number,
  from_name: t.sender_name,
  from_email: t.sender_email,
  subject: t.subject,
  body: t.description,
  ai_summary: t.ai_summary || t.description?.slice(0, 120) + '...',
  ai_category: t.category,
  ai_priority: t.priority,
  status: t.status,
  received_at: t.created_at,
  assigned_to: t.assigned_to ? {
    id: t.assigned_to,
    name: t.assigned_to_name || 'Staff',
    initials: initials(t.assigned_to_name || 'Staff'),
    color: staffColor(t.assigned_to),
  } : null,
});

export default function Dashboard({ onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);

  // Load tickets from backend on mount
  useEffect(() => {
    loadTickets();
    loadStaff();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tickets');
      const normalized = (res.data.tickets || []).map(normalizeTicket);
      setTickets(normalized);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStaff = async () => {
    try {
      const res = await api.get('/admin/users?status=approved');
      const members = (res.data.users || []).map(u => ({
        id: u.id,
        name: `${u.first_name} ${u.last_name}`,
        role: u.department,
        initials: initials(`${u.first_name} ${u.last_name}`),
        color: staffColor(u.id),
      }));
      setStaff(members);
    } catch (err) {
      console.error('Failed to load staff:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTickets();
    setRefreshing(false);
  };

  const handleGmailSync = async () => {
    setSyncing(true);
    try {
      const res = await api.post('/gmail/sync');
      if (res.data.tickets && res.data.tickets.length > 0) {
        const normalized = res.data.tickets.map(normalizeTicket);
        setTickets(prev => [...normalized, ...prev]);
      }
      setLastSync(new Date());
      alert(`✅ ${res.data.message}`);
    } catch (err) {
      alert('❌ Gmail sync failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSyncing(false);
    }
  };

  const handleAssign = async (ticketId, staffMember) => {
    try {
      await api.patch(`/tickets/${ticketId}`, { assignedTo: staffMember.id });
      setTickets(prev => prev.map(t =>
        t.id === ticketId
          ? { ...t, assigned_to: staffMember, status: t.status === 'new' ? 'in_progress' : t.status }
          : t
      ));
      if (selected?.id === ticketId) setSelected(prev => ({
        ...prev, assigned_to: staffMember, status: prev.status === 'new' ? 'in_progress' : prev.status
      }));
    } catch (err) {
      alert('Failed to assign ticket: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleStatusChange = async (ticketId, status) => {
    try {
      await api.patch(`/tickets/${ticketId}`, { status });
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
      if (selected?.id === ticketId) setSelected(prev => ({ ...prev, status }));
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.error || err.message));
    }
  };

  const filtered = tickets.filter(t => {
    const matchSearch = !search ||
      t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.from_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.from_email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.status === filter;
    return matchSearch && matchFilter;
  });

  const getCount = (s) => tickets.filter(t => t.status === s).length;

  const stats = [
    { label: 'Unassigned', value: tickets.filter(t => !t.assigned_to).length, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', Icon: IconUnassigned },
    { label: 'In Progress', value: getCount('in_progress'), color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', Icon: IconInProgress },
    { label: 'Resolved', value: getCount('resolved'), color: '#10b981', bg: 'rgba(16,185,129,0.1)', Icon: IconResolved },
    { label: 'Total', value: tickets.length, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', Icon: IconUnassigned },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Navbar onLogout={onLogout} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontSize: 30, fontWeight: 800, margin: '0 0 5px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Museum Command
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 13 }}>IT ticket inbox · Crystal Bridges</p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleGmailSync} disabled={syncing} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px',
              background: syncing ? 'rgba(234,67,53,0.12)' : 'rgba(234,67,53,0.08)',
              border: '1px solid rgba(234,67,53,0.25)',
              borderRadius: 10, color: '#ea4335', cursor: syncing ? 'not-allowed' : 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans', transition: 'all 0.2s',
            }}>
              <span style={{ animation: syncing ? 'spin 1s linear infinite' : 'none', display: 'flex' }}>
                <IconMail />
              </span>
              {syncing ? 'Syncing Gmail...' : 'Sync Gmail'}
            </button>

            <button onClick={handleRefresh} disabled={refreshing} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px',
              background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 10, color: '#3b82f6', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans', transition: 'all 0.2s',
            }}>
              <span style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none', display: 'flex' }}>
                <IconRefresh />
              </span>
              Refresh
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {stats.map((s, i) => (
            <div key={i} className="glass-card stat-card" style={{ borderRadius: 14, padding: '18px 20px', '--accent-color': s.color }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: '0 0 8px', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: s.color, fontFamily: 'Syne', lineHeight: 1 }}>{s.value}</p>
                </div>
                <div style={{ width: 38, height: 38, background: s.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                  <s.Icon />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gmail connected banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
          background: 'rgba(234,67,53,0.06)', border: '1px solid rgba(234,67,53,0.15)',
          borderRadius: 12, marginBottom: 18,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.5)', flexShrink: 0, animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'DM Sans' }}>
            Gmail inbox connected — Gemini AI is monitoring for IT tickets
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
            {lastSync ? `Last sync: ${formatTime(lastSync)}` : 'Click Sync Gmail to fetch emails'}
          </span>
        </div>

        {/* Search + filter */}
        <div className="glass-card" style={{ borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
              <IconSearch />
            </div>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search tickets, senders..."
              className="input-dark"
              style={{ width: '100%', padding: '9px 14px 9px 38px', borderRadius: 9, fontSize: 13, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {['all', 'new', 'in_progress', 'resolved'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '5px 13px', borderRadius: 7, border: `1px solid ${filter === f ? 'transparent' : 'var(--card-border)'}`,
                cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans', transition: 'all 0.18s',
                background: filter === f ? '#2563eb' : 'var(--card-bg)',
                color: filter === f ? '#fff' : 'var(--text-muted)',
                boxShadow: filter === f ? '0 0 14px rgba(37,99,235,0.25)' : 'none',
              }}>
                {f.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                {f !== 'all' && <span style={{ marginLeft: 5, opacity: 0.7, fontSize: 10 }}>{getCount(f)}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Ticket list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} className="glass-card" style={{ borderRadius: 14, padding: '20px', height: 90, animation: 'shimmer 1.5s infinite' }} />
            ))
          ) : filtered.length === 0 ? (
            <div className="glass-card" style={{ borderRadius: 14, padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                {tickets.length === 0 ? 'No tickets yet — click Sync Gmail to fetch emails' : 'No tickets match your filter'}
              </p>
            </div>
          ) : filtered.map((ticket, i) => {
            const cat = categoryColors[ticket.ai_category] || categoryColors.other;
            const pulse = priorityColor[ticket.ai_priority] || '#64748b';
            return (
              <div
                key={ticket.id}
                onClick={() => setSelected(ticket)}
                className="ticket-card"
                style={{
                  borderRadius: 14, padding: '16px 20px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                  animation: `fadeInUp 0.4s ease ${i * 0.04}s both`,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', left: 0, top: '15%', bottom: '15%', width: 3, background: pulse, borderRadius: '0 3px 3px 0', opacity: 0.7 }} />

                <div style={{ width: 40, height: 40, background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color, flexShrink: 0 }}>
                  <IconMail />
                </div>

                <span style={{ fontSize: 10, color: '#3b82f6', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', width: 88, flexShrink: 0 }}>
                  {ticket.ticket_number || ticket.id}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Syne', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ticket.subject}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{ticket.from_name}</span>
                    <span style={{ color: 'var(--text-muted)', opacity: 0.4 }}>·</span>
                    <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>{ticket.from_email}</span>
                  </div>
                  {ticket.ai_summary && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                      <span style={{ color: '#3b82f6', flexShrink: 0, marginTop: 1 }}><IconSparkles /></span>
                      <p style={{ margin: 0, fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                        {ticket.ai_summary}
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7, flexShrink: 0 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className={`priority-${ticket.ai_priority}`} style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {ticket.ai_priority}
                    </span>
                    <span className={`badge-${ticket.status}`} style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {ticket.status?.replace('_', ' ')}
                    </span>
                  </div>

                  {ticket.assigned_to ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: ticket.assigned_to.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 800, fontFamily: 'Syne' }}>
                        {ticket.assigned_to.initials}
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ticket.assigned_to.name?.split(' ')[0]}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 10, color: '#f43f5e', background: 'rgba(244,63,94,0.08)', padding: '2px 7px', borderRadius: 20, border: '1px solid rgba(244,63,94,0.2)' }}>
                      Unassigned
                    </span>
                  )}

                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {formatTime(ticket.received_at)}
                  </span>
                </div>

                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </div>
            );
          })}
        </div>

        {filtered.length > 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, marginTop: 18, fontFamily: 'JetBrains Mono, monospace' }}>
            {filtered.length} / {tickets.length} tickets
          </p>
        )}
      </div>

      {selected && (
        <EmailTicketModal
          ticket={selected}
          staff={staff}
          onClose={() => setSelected(null)}
          onAssign={handleAssign}
          onStatusChange={handleStatusChange}
        />
      )}

      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes shimmer { 0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5} }
      `}</style>
    </div>
  );
}