import { useState } from 'react';

const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconSparkles = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);
const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const priorityColor = { urgent: '#a78bfa', high: '#f43f5e', medium: '#f59e0b', low: '#10b981' };

function EmailPreview({ ticket }) {
  const lines = ticket.body.split('\n');
  return (
    <div style={{
      background: 'var(--navy-mid)',
      border: '1px solid var(--card-border)',
      borderRadius: 12, overflow: 'hidden',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {/* Email header bar */}
      <div style={{ background: 'rgba(234,67,53,0.06)', borderBottom: '1px solid var(--divider)', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e', opacity: 0.7 }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', opacity: 0.7 }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', opacity: 0.7 }} />
          <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>Gmail — Original Message</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{ticket.subject}</div>
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <IconUser /> {ticket.from_name} &lt;{ticket.from_email}&gt;
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <IconMail /> To: it@crystalbridges.org
          </span>
        </div>
      </div>
      {/* Email body */}
      <div style={{ padding: '16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', maxHeight: 200, overflowY: 'auto' }}>
        {ticket.body}
      </div>
    </div>
  );
}

export default function EmailTicketModal({ ticket, staff, onClose, onAssign, onStatusChange }) {
  const [activeTab, setActiveTab] = useState('email');
  const [assignOpen, setAssignOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const pulse = priorityColor[ticket.ai_priority];

  const handleAssign = (member) => {
    onAssign(ticket.id, member);
    setAssignOpen(false);
  };

  const handleStatusChange = (status) => {
    setUpdatingStatus(true);
    setTimeout(() => {
      onStatusChange(ticket.id, status);
      setUpdatingStatus(false);
    }, 400);
  };

  const statusActions = [
    { status: 'new', label: 'Mark New', color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)' },
    { status: 'in_progress', label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
    { status: 'resolved', label: 'Mark Resolved', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.2s ease' }} />

      <div style={{
        position: 'relative', width: '100%', maxWidth: 920, height: '88vh',
        background: 'var(--modal-bg)', border: '1px solid var(--card-border)',
        borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        animation: 'modalIn 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{ticket.id}</span>
              <span className={`badge-${ticket.status}`} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span className={`priority-${ticket.ai_priority}`} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: pulse, display: 'inline-block', boxShadow: `0 0 5px ${pulse}`, animation: ['urgent','high'].includes(ticket.ai_priority) ? 'pulse-dot 1.5s infinite' : 'none' }} />
                {ticket.ai_priority}
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: 17, color: 'var(--text-primary)', fontFamily: 'Syne', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ticket.subject}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
              From: <span style={{ color: 'var(--text-secondary)' }}>{ticket.from_name}</span> · <span style={{ color: 'var(--text-muted)' }}>{ticket.from_email}</span>
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Main */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid var(--divider)', flexShrink: 0 }}>
              {[
                { id: 'email', label: 'Original Email' },
                { id: 'ai', label: 'AI Analysis' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  padding: '13px 16px', background: 'none', border: 'none',
                  color: activeTab === tab.id ? '#3b82f6' : 'var(--text-muted)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  position: 'relative', fontFamily: 'DM Sans', transition: 'color 0.15s',
                }}>
                  {tab.label}
                  {activeTab === tab.id && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#2563eb', borderRadius: '2px 2px 0 0' }} />}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
              {activeTab === 'email' && (
                <div>
                  <p style={{ margin: '0 0 12px', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    EMAIL RECEIVED · {new Date(ticket.received_at).toLocaleString()}
                  </p>
                  <EmailPreview ticket={ticket} />
                </div>
              )}

              {activeTab === 'ai' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* AI Summary card */}
                  <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 12, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#60a5fa', marginBottom: 10 }}>
                      <IconSparkles />
                      <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gemini AI Summary</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.65 }}>{ticket.ai_summary}</p>
                  </div>

                  {/* Detected fields */}
                  <div className="glass-card" style={{ borderRadius: 12, padding: '16px 18px' }}>
                    <p style={{ margin: '0 0 12px', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Detected Fields</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'Category', value: ticket.ai_category },
                        { label: 'Priority', value: ticket.ai_priority },
                        { label: 'Sender', value: `${ticket.from_name} <${ticket.from_email}>` },
                        { label: 'Received', value: new Date(ticket.received_at).toLocaleString() },
                      ].map((row, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: i < 3 ? '1px solid var(--divider)' : 'none' }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 10 }}>{row.label}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'capitalize' }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ width: 260, background: 'var(--card-bg)', borderLeft: '1px solid var(--divider)', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 22, overflowY: 'auto', flexShrink: 0 }}>

            {/* Assign section */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>
                Assigned To
              </p>

              {ticket.assigned_to ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--navy-mid)', borderRadius: 10, border: '1px solid var(--card-border)', marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: ticket.assigned_to.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 800, fontFamily: 'Syne', flexShrink: 0 }}>
                    {ticket.assigned_to.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>{ticket.assigned_to.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{ticket.assigned_to.role}</div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '10px 12px', background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: 10, marginBottom: 8 }}>
                  <p style={{ margin: 0, fontSize: 12, color: '#f43f5e', fontWeight: 600 }}>Not assigned yet</p>
                </div>
              )}

              {/* Assign dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setAssignOpen(!assignOpen)}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 9,
                    background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)',
                    color: '#3b82f6', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.14)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; }}
                >
                  <IconUser />
                  {ticket.assigned_to ? 'Reassign' : 'Assign to staff'}
                </button>

                {assignOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                    background: 'var(--modal-bg)', border: '1px solid var(--card-border)',
                    borderRadius: 12, overflow: 'hidden', zIndex: 10,
                    boxShadow: 'var(--shadow-lg)', animation: 'slideUp 0.15s ease',
                  }}>
                    {staff.map(member => (
                      <div
                        key={member.id}
                        onClick={() => handleAssign(member)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                          cursor: 'pointer', transition: 'background 0.15s',
                          borderBottom: '1px solid var(--divider)',
                          background: ticket.assigned_to?.id === member.id ? 'rgba(37,99,235,0.06)' : 'transparent',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = ticket.assigned_to?.id === member.id ? 'rgba(37,99,235,0.06)' : 'transparent'}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 800, fontFamily: 'Syne', flexShrink: 0 }}>
                          {member.initials}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>{member.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{member.role}</div>
                        </div>
                        {ticket.assigned_to?.id === member.id && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>Update Status</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {statusActions.map(action => (
                  <button
                    key={action.status}
                    onClick={() => handleStatusChange(action.status)}
                    disabled={updatingStatus || ticket.status === action.status}
                    style={{
                      padding: '9px 12px', borderRadius: 9, cursor: ticket.status === action.status ? 'default' : 'pointer',
                      background: ticket.status === action.status ? action.bg : 'var(--navy-mid)',
                      border: `1px solid ${ticket.status === action.status ? action.border : 'var(--card-border)'}`,
                      color: ticket.status === action.status ? action.color : 'var(--text-secondary)',
                      fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans', textAlign: 'left',
                      transition: 'all 0.18s', opacity: updatingStatus ? 0.6 : 1,
                    }}
                    onMouseEnter={e => { if (ticket.status !== action.status) { e.currentTarget.style.background = action.bg; e.currentTarget.style.borderColor = action.border; e.currentTarget.style.color = action.color; }}}
                    onMouseLeave={e => { if (ticket.status !== action.status) { e.currentTarget.style.background = 'var(--navy-mid)'; e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category tag */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>Category</p>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--navy-mid)', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--card-border)', textTransform: 'capitalize', display: 'inline-block' }}>
                {ticket.ai_category}
              </span>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)} }
      `}</style>
    </div>
  );
}