import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import api from '../api';

// ─── ICONS ───────────────────────────────────────────────────────────────────
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconPending = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconShield = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const staffColor = (id) => ['#2563eb','#7c3aed','#059669','#db2777','#d97706','#0891b2'][id % 6];
const initials = (first, last) => `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function Admin({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadUsers(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, name) => {
    setActionLoading(id + '-approve');
    try {
      await api.patch(`/admin/users/${id}/approve`);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'approved' } : u));
      showToast(`✅ ${name} has been approved`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to approve', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id, name) => {
    setActionLoading(id + '-reject');
    try {
      await api.patch(`/admin/users/${id}/reject`);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'rejected' } : u));
      showToast(`${name}'s account has been rejected`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to reject', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    setActionLoading(id + '-delete');
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      showToast(`${name} has been deleted`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (id, role, name) => {
    setActionLoading(id + '-role');
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      showToast(`${name} is now ${role}`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update role', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const pending = users.filter(u => u.status === 'pending');
  const approved = users.filter(u => u.status === 'approved');
  const rejected = users.filter(u => u.status === 'rejected');

  const filteredUsers = (tab === 'pending' ? pending : tab === 'approved' ? approved : rejected)
    .filter(u => {
      const q = search.toLowerCase();
      return !q ||
        u.first_name?.toLowerCase().includes(q) ||
        u.last_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.department?.toLowerCase().includes(q);
    });

  const stats = [
    { label: 'Pending Approval', value: pending.length, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', Icon: IconPending },
    { label: 'Active Staff', value: approved.length, color: '#10b981', bg: 'rgba(16,185,129,0.1)', Icon: IconCheck },
    { label: 'Total Users', value: users.length, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', Icon: IconUsers },
    { label: 'Rejected', value: rejected.length, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', Icon: IconX },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Navbar onLogout={onLogout} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 80, right: 24, zIndex: 999,
              background: toast.type === 'error' ? 'rgba(244,63,94,0.12)' : 'rgba(16,185,129,0.12)',
              border: `1px solid ${toast.type === 'error' ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`,
              color: toast.type === 'error' ? '#f43f5e' : '#10b981',
              padding: '12px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600,
              fontFamily: 'DM Sans', backdropFilter: 'blur(12px)',
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: 30, fontWeight: 800, margin: '0 0 5px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Admin Panel
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 13 }}>Manage staff accounts · Crystal Bridges</p>
        </div>

        {/* Stat Cards */}
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

        {/* Pending alert banner */}
        {pending.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 12, marginBottom: 18,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.5)', flexShrink: 0, animation: 'pulse-dot 2s infinite' }} />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'DM Sans' }}>
              <strong style={{ color: '#f59e0b' }}>{pending.length} account{pending.length > 1 ? 's' : ''}</strong> waiting for your approval
            </span>
          </div>
        )}

        {/* Search + Tabs */}
        <div className="glass-card" style={{ borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
              <IconSearch />
            </div>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, department..."
              className="input-dark"
              style={{ width: '100%', padding: '9px 14px 9px 38px', borderRadius: 9, fontSize: 13, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {[
              { key: 'pending', label: 'Pending', count: pending.length, color: '#f59e0b' },
              { key: 'approved', label: 'Approved', count: approved.length, color: '#10b981' },
              { key: 'rejected', label: 'Rejected', count: rejected.length, color: '#f43f5e' },
            ].map(({ key, label, count, color }) => (
              <button key={key} onClick={() => setTab(key)} style={{
                padding: '5px 13px', borderRadius: 7,
                border: `1px solid ${tab === key ? 'transparent' : 'var(--card-border)'}`,
                cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans', transition: 'all 0.18s',
                background: tab === key ? '#2563eb' : 'var(--card-bg)',
                color: tab === key ? '#fff' : 'var(--text-muted)',
                boxShadow: tab === key ? '0 0 14px rgba(37,99,235,0.25)' : 'none',
              }}>
                {label}
                <span style={{ marginLeft: 5, opacity: 0.8, fontSize: 10 }}>{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} className="glass-card" style={{ borderRadius: 14, padding: 20, height: 80, animation: 'shimmer 1.5s infinite' }} />
            ))
          ) : filteredUsers.length === 0 ? (
            <div className="glass-card" style={{ borderRadius: 14, padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>No {tab} users found</p>
            </div>
          ) : filteredUsers.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card"
              style={{
                borderRadius: 14, padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Left accent */}
              <div style={{
                position: 'absolute', left: 0, top: '15%', bottom: '15%', width: 3,
                background: user.status === 'pending' ? '#f59e0b' : user.status === 'approved' ? '#10b981' : '#f43f5e',
                borderRadius: '0 3px 3px 0', opacity: 0.7,
              }} />

              {/* Avatar */}
              <div style={{
                width: 42, height: 42, borderRadius: 11, flexShrink: 0,
                background: `linear-gradient(135deg, ${staffColor(user.id)}, ${staffColor(user.id)}99)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: 'Syne',
              }}>
                {initials(user.first_name, user.last_name)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Syne' }}>
                    {user.first_name} {user.last_name}
                  </h4>
                  {user.role === 'admin' && (
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <IconShield /> Admin
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span>{user.email}</span>
                  {user.department && <><span style={{ opacity: 0.4 }}>·</span><span>{user.department}</span></>}
                  {user.employee_id && <><span style={{ opacity: 0.4 }}>·</span><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>#{user.employee_id}</span></>}
                  {user.created_at && <><span style={{ opacity: 0.4 }}>·</span><span>Joined {formatDate(user.created_at)}</span></>}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

                {/* Role toggle for approved users */}
                {user.status === 'approved' && (
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value, user.first_name)}
                    disabled={actionLoading === user.id + '-role'}
                    style={{
                      padding: '5px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      fontFamily: 'DM Sans', cursor: 'pointer',
                      background: 'var(--card-bg)', color: 'var(--text-secondary)',
                      border: '1px solid var(--card-border)',
                    }}
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                )}

                {/* Approve button for pending */}
                {user.status === 'pending' && (
                  <button
                    onClick={() => handleApprove(user.id, user.first_name)}
                    disabled={actionLoading === user.id + '-approve'}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.3)',
                      background: 'rgba(16,185,129,0.1)', color: '#10b981',
                      cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'DM Sans',
                      transition: 'all 0.18s',
                      opacity: actionLoading === user.id + '-approve' ? 0.6 : 1,
                    }}
                  >
                    <IconCheck /> {actionLoading === user.id + '-approve' ? 'Approving...' : 'Approve'}
                  </button>
                )}

                {/* Reject button for pending */}
                {user.status === 'pending' && (
                  <button
                    onClick={() => handleReject(user.id, user.first_name)}
                    disabled={actionLoading === user.id + '-reject'}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(244,63,94,0.3)',
                      background: 'rgba(244,63,94,0.1)', color: '#f43f5e',
                      cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'DM Sans',
                      transition: 'all 0.18s',
                      opacity: actionLoading === user.id + '-reject' ? 0.6 : 1,
                    }}
                  >
                    <IconX /> {actionLoading === user.id + '-reject' ? 'Rejecting...' : 'Reject'}
                  </button>
                )}

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(user.id, `${user.first_name} ${user.last_name}`)}
                  disabled={actionLoading === user.id + '-delete'}
                  title="Delete user"
                  style={{
                    width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(244,63,94,0.15)',
                    background: 'rgba(244,63,94,0.06)', color: 'var(--text-muted)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.18s',
                    opacity: actionLoading === user.id + '-delete' ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.15)'; e.currentTarget.style.color = '#f43f5e'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.06)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <IconTrash />
                </button>

              </div>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length > 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, marginTop: 18, fontFamily: 'JetBrains Mono, monospace' }}>
            {filteredUsers.length} users
          </p>
        )}
      </div>

      <style>{`
        @keyframes shimmer { 0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)} }
      `}</style>
    </div>
  );
}