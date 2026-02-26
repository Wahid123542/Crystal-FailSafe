import { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-hot-toast';

const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconSparkles = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const IconSend = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;

export default function TicketModal({ ticket, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [reply, setReply] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    setAiLoading(true);
    setAiAnalysis(null);
    const t = setTimeout(() => {
      setAiAnalysis("Likely a network hardware failure in the North Wing. Similar pattern to Ticket #882 — recommend checking DHCP lease on VLAN 4 first.");
      setAiLoading(false);
    }, 1400);
    return () => clearTimeout(t);
  }, [ticket.id]);

  const updateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      await api.patch(`/tickets/${ticket.id}`, { status: newStatus });
      toast.success(`Ticket marked as ${newStatus.replace('_', ' ')}`);
      onUpdate();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const statusActions = [
    { status: 'in_progress', label: 'Mark In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
    { status: 'resolved', label: 'Mark Resolved', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
    { status: 'closed', label: 'Close Ticket', color: '#64748b', bg: 'rgba(100,116,139,0.06)', border: 'rgba(100,116,139,0.15)' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.2s ease' }} />

      {/* Modal */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: 880, height: '85vh',
        background: 'var(--modal-bg)', border: '1px solid var(--card-border)',
        borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        animation: 'modalIn 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>#{ticket.id}</span>
              <span className={`badge-${ticket.status}`} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{ticket.status.replace('_', ' ')}</span>
              <span className={`priority-${ticket.priority}`} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{ticket.priority}</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 18, color: 'var(--text-primary)', fontFamily: 'Syne', fontWeight: 700 }}>{ticket.subject}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 6, transition: 'all 0.15s', display: 'flex' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Main panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--divider)', overflow: 'hidden' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, padding: '0 24px', borderBottom: '1px solid var(--divider)', flexShrink: 0 }}>
              {['chat', 'details', 'history'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '14px 18px', background: 'none', border: 'none',
                  color: activeTab === tab ? '#3b82f6' : 'var(--text-muted)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  position: 'relative', textTransform: 'capitalize', fontFamily: 'DM Sans',
                  transition: 'color 0.15s',
                }}>
                  {tab}
                  {activeTab === tab && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#2563eb', borderRadius: '2px 2px 0 0' }} />}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
              {activeTab === 'chat' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: 'var(--card-bg)', padding: 16, borderRadius: 12, border: '1px solid var(--card-border)' }}>
                    <p style={{ margin: '0 0 10px', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      INITIAL REQUEST — {new Date(ticket.created_at).toLocaleString()}
                    </p>
                    <p style={{ margin: '0 0 12px', lineHeight: 1.65, color: 'var(--text-primary)', fontSize: 14 }}>{ticket.description}</p>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                      <span>From: <span style={{ color: 'var(--text-secondary)' }}>{ticket.sender}</span></span>
                      <span>Dept: <span style={{ color: 'var(--text-secondary)' }}>{ticket.department}</span></span>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'details' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Ticket ID', value: ticket.id },
                    { label: 'Category', value: ticket.category },
                    { label: 'Department', value: ticket.department },
                    { label: 'Sender', value: ticket.sender },
                    { label: 'Created', value: new Date(ticket.created_at).toLocaleString() },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--divider)' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.label}</span>
                      <span style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'history' && (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }}>
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <p style={{ margin: 0, fontSize: 14 }}>No activity history yet</p>
                </div>
              )}
            </div>

            {/* Reply */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--divider)', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={reply} onChange={e => setReply(e.target.value)}
                  placeholder="Type your response to the staff member..."
                  className="input-dark"
                  style={{ width: '100%', height: 90, borderRadius: 10, padding: '12px 14px', fontSize: 13, resize: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, gap: 8 }}>
                <button
                  disabled={!reply.trim()}
                  className="btn-primary"
                  style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7, opacity: reply.trim() ? 1 : 0.5 }}
                >
                  <IconSend /> Send Reply
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ width: 280, padding: '20px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto', background: 'var(--card-bg)' }}>

            {/* AI insight */}
            <div style={{ background: 'rgba(37,99,235,0.06)', borderRadius: 12, padding: 16, border: '1px solid rgba(37,99,235,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#60a5fa', marginBottom: 10 }}>
                <IconSparkles />
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Analysis</span>
              </div>
              {aiLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ height: 10, borderRadius: 4, width: '90%' }} />
                  <div className="skeleton" style={{ height: 10, borderRadius: 4, width: '70%' }} />
                  <div className="skeleton" style={{ height: 10, borderRadius: 4, width: '80%' }} />
                </div>
              ) : (
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{aiAnalysis}</p>
              )}
            </div>

            {/* Status actions */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10, margin: '0 0 10px' }}>Update Status</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {statusActions.map(action => (
                  <button
                    key={action.status}
                    onClick={() => updateStatus(action.status)}
                    disabled={isUpdating || ticket.status === action.status}
                    style={{
                      padding: '10px 14px', borderRadius: 9, cursor: ticket.status === action.status ? 'default' : 'pointer',
                      background: ticket.status === action.status ? action.bg : 'var(--card-bg)',
                      border: `1px solid ${ticket.status === action.status ? action.border : 'var(--card-border)'}`,
                      color: ticket.status === action.status ? action.color : 'var(--text-secondary)',
                      fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans',
                      textAlign: 'left', transition: 'all 0.18s',
                      opacity: isUpdating ? 0.6 : 1,
                    }}
                    onMouseEnter={e => { if (ticket.status !== action.status) { e.currentTarget.style.background = action.bg; e.currentTarget.style.borderColor = action.border; e.currentTarget.style.color = action.color; }}}
                    onMouseLeave={e => { if (ticket.status !== action.status) { e.currentTarget.style.background = 'var(--card-bg)'; e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket info */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>Ticket Info</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Department', value: ticket.department },
                  { label: 'Category', value: ticket.category },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'capitalize' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>
    </div>
  );
}