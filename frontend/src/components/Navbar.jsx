import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const IconDashboard = ({ active }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconAnalytics = ({ active }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const IconSettings = ({ active }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IconBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconShield = ({ active }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const IconBulbOff = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18"/>
    <line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
  </svg>
);

const IconBulbOn = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18"/>
    <line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
  </svg>
);

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggle } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [bulbAnimating, setBulbAnimating] = useState(false);
  const notifRef = useRef(null);

  const userData = (() => {
    try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; }
  })();
  const displayName = userData.firstName || userData.email?.split('@')[0] || 'IT Staff';
  const initials = displayName.slice(0, 2).toUpperCase();
  const isAdmin = userData.role === 'admin';

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    navigate('/login');
  };

  const handleThemeToggle = () => {
    setBulbAnimating(true);
    toggle();
    setTimeout(() => setBulbAnimating(false), 400);
  };

  const isActive = (path) => location.pathname === path;

  const notifications = [
    { id: 1, text: 'New high-priority ticket assigned', time: '2m ago', unread: true },
    { id: 2, text: 'Ticket #1038 resolved by Sarah J.', time: '18m ago', unread: true },
    { id: 3, text: 'SLA warning: Ticket #1031 overdue', time: '1h ago', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  const navLinks = [
    { path: '/dashboard', icon: <IconDashboard active={isActive('/dashboard')} />, label: 'Dashboard' },
    { path: '/analytics', icon: <IconAnalytics active={isActive('/analytics')} />, label: 'Analytics' },
    ...(isAdmin ? [{ path: '/admin', icon: <IconShield active={isActive('/admin')} />, label: 'Admin' }] : []),
  ];

  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }}>

        {/* Logo */}
        <div onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
          <div style={{
            width: 36, height: 36,
            background: 'rgba(37,99,235,0.12)',
            border: '1px solid rgba(37,99,235,0.25)',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#3b82f6',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.2)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.12)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <IconShield active={false} />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.01em' }}>Crystal FailSafe</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 2 }}>IT Support</div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navLinks.map(({ path, icon, label }) => (
            <button key={path} onClick={() => navigate(path)} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans', transition: 'all 0.18s',
              background: isActive(path) ? 'rgba(37,99,235,0.1)' : 'transparent',
              color: isActive(path) ? '#3b82f6' : 'var(--text-muted)',
              position: 'relative',
            }}
              onMouseEnter={e => { if (!isActive(path)) { e.currentTarget.style.background = 'rgba(37,99,235,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
              onMouseLeave={e => { if (!isActive(path)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
            >
              {icon}
              {label}
              {isActive(path) && (
                <span style={{
                  position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 20, height: 2, background: '#2563eb', borderRadius: 2,
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`theme-toggle ${!isDark ? 'light-active' : ''}`}
            style={{ animation: bulbAnimating ? 'lightbulbOn 0.4s ease' : 'none' }}
          >
            {isDark ? <IconBulbOff /> : <IconBulbOn />}
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: 'var(--divider)', margin: '0 2px' }} />

          {/* Notification bell */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              style={{
                width: 36, height: 36,
                background: notifOpen ? 'rgba(37,99,235,0.1)' : 'transparent',
                border: '1px solid ' + (notifOpen ? 'rgba(37,99,235,0.25)' : 'var(--card-border)'),
                borderRadius: 9, cursor: 'pointer', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s', position: 'relative',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)'; e.currentTarget.style.color = '#3b82f6'; }}
              onMouseLeave={e => { if (!notifOpen) { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >
              <IconBell />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 7, height: 7, background: '#e11d48',
                  borderRadius: '50%', border: '1.5px solid var(--navy)',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }} />
              )}
            </button>

            {notifOpen && (
              <div className="animate-slide-up" style={{
                position: 'absolute', top: 44, right: 0, width: 310,
                background: 'var(--modal-bg)', border: '1px solid var(--card-border)',
                borderRadius: 12, overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)', zIndex: 200,
              }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Notifications</span>
                  <button style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 12, cursor: 'pointer', fontWeight: 600, fontFamily: 'DM Sans' }}>
                    Mark all read
                  </button>
                </div>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '12px 18px', borderBottom: '1px solid var(--divider)',
                    background: n.unread ? 'rgba(37,99,235,0.04)' : 'transparent',
                    cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'flex-start',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,99,235,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = n.unread ? 'rgba(37,99,235,0.04)' : 'transparent'}
                  >
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                      background: n.unread ? '#2563eb' : 'transparent',
                      boxShadow: n.unread ? '0 0 6px rgba(37,99,235,0.5)' : 'none',
                    }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 13, color: n.unread ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: 1.5 }}>{n.text}</p>
                      <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{n.time}</p>
                    </div>
                  </div>
                ))}
                <div style={{ padding: '10px 18px', textAlign: 'center' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: 'var(--divider)', margin: '0 2px' }} />

          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 12, fontFamily: 'Syne',
              letterSpacing: '0.02em',
            }}>
              {initials}
            </div>
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{displayName}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
                {isAdmin ? 'Admin' : 'IT Staff'}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              width: 34, height: 34,
              background: 'rgba(225,29,72,0.06)',
              border: '1px solid rgba(225,29,72,0.12)',
              borderRadius: 8, cursor: 'pointer', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.18s', marginLeft: 2,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(225,29,72,0.12)'; e.currentTarget.style.color = '#f43f5e'; e.currentTarget.style.borderColor = 'rgba(225,29,72,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(225,29,72,0.06)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(225,29,72,0.12)'; }}
          >
            <IconLogout />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes lightbulbOn {
          0% { filter: brightness(1) drop-shadow(0 0 0px transparent); }
          40% { filter: brightness(1.5) drop-shadow(0 0 8px #fbbf24); }
          100% { filter: brightness(1) drop-shadow(0 0 0px transparent); }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;