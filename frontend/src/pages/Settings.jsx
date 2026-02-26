import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const tabs = [
  {
    id: 'general', label: 'General',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  },
  {
    id: 'galleries', label: 'Museum Galleries',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
  },
  {
    id: 'team', label: 'IT Team',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  },
  {
    id: 'ai', label: 'AI Configuration',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
  },
];

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24,
        background: checked ? '#2563eb' : 'var(--slate)',
        borderRadius: 20, position: 'relative', cursor: 'pointer',
        transition: 'background 0.25s ease',
        flexShrink: 0,
        boxShadow: checked ? '0 0 12px rgba(37,99,235,0.3)' : 'none',
      }}
    >
      <div style={{
        width: 18, height: 18, background: 'white', borderRadius: '50%',
        position: 'absolute', top: 3, left: checked ? 23 : 3,
        transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </div>
  );
}

function SettingRow({ label, description, value, toggle, checked, onChange }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      paddingBottom: 20, borderBottom: '1px solid var(--divider)',
    }}>
      <div style={{ flex: 1, paddingRight: 24 }}>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, fontSize: 14 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{description}</div>
      </div>
      {toggle ? (
        <Toggle checked={checked} onChange={onChange} />
      ) : (
        <input
          className="input-dark"
          defaultValue={value}
          style={{ padding: '8px 12px', borderRadius: 8, width: 200, fontSize: 13 }}
        />
      )}
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [toggles, setToggles] = useState({
    maintenance: false,
    drafting: true,
    autocategorize: true,
    sentiment: true,
  });

  const setToggle = (key) => (val) => setToggles(t => ({ ...t, [key]: val }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Navbar />

      <div className="animate-fade-in" style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 6px', fontFamily: 'Syne', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            System Settings
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>Configure your Crystal FailSafe environment</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 28 }}>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: activeTab === tab.id ? 'rgba(37,99,235,0.1)' : 'transparent',
                  color: activeTab === tab.id ? '#3b82f6' : 'var(--text-muted)',
                  fontWeight: 600, fontSize: 13, fontFamily: 'DM Sans',
                  transition: 'all 0.18s',
                  borderLeft: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                }}
                onMouseEnter={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
              >
                <span style={{ color: activeTab === tab.id ? '#3b82f6' : 'var(--text-muted)' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-card"
            style={{ padding: '28px 32px', borderRadius: 20 }}
          >
            {activeTab === 'general' && (
              <div>
                <h3 style={{ margin: '0 0 6px', color: 'var(--text-primary)', fontFamily: 'Syne', fontWeight: 700, fontSize: 17 }}>General Configuration</h3>
                <p style={{ margin: '0 0 24px', color: 'var(--text-muted)', fontSize: 13 }}>Core system settings for the portal.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <SettingRow label="Museum Name" description="Display name shown throughout the portal" value="Crystal Bridges Museum of American Art" />
                  <SettingRow label="Maintenance Mode" description="Restrict portal access to IT admins only" toggle checked={toggles.maintenance} onChange={setToggle('maintenance')} />
                  <SettingRow label="Auto-Refresh Rate" description="How often the dashboard syncs with the server (seconds)" value="30" />
                </div>
              </div>
            )}

            {activeTab === 'galleries' && (
              <div>
                <h3 style={{ margin: '0 0 6px', color: 'var(--text-primary)', fontFamily: 'Syne', fontWeight: 700, fontSize: 17 }}>Museum Galleries</h3>
                <p style={{ margin: '0 0 24px', color: 'var(--text-muted)', fontSize: 13 }}>Manage gallery locations for ticket routing.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {['North Wing', 'South Wing', 'Great Hall', 'Bridge Gallery', 'Sculpture Trail'].map((g, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, borderBottom: '1px solid var(--divider)' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14, marginBottom: 3 }}>{g}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Gallery zone · {3 + i} active devices</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#10b981', background: 'rgba(16,185,129,0.08)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                        Online
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div>
                <h3 style={{ margin: '0 0 6px', color: 'var(--text-primary)', fontFamily: 'Syne', fontWeight: 700, fontSize: 17 }}>IT Team</h3>
                <p style={{ margin: '0 0 24px', color: 'var(--text-muted)', fontSize: 13 }}>Manage IT staff and their portal permissions.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { name: 'Marcus Rivera', role: 'IT Lead', status: 'online' },
                    { name: 'Sarah Jennings', role: 'Systems Admin', status: 'online' },
                    { name: 'David Park', role: 'Network Eng.', status: 'away' },
                    { name: 'Amara Osei', role: 'Support Tech', status: 'offline' },
                  ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--card-bg)', borderRadius: 12, border: '1px solid var(--card-border)' }}>
                      <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12, fontFamily: 'Syne', flexShrink: 0 }}>
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.role}</div>
                      </div>
                      <div style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                        background: m.status === 'online' ? 'rgba(16,185,129,0.1)' : m.status === 'away' ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.1)',
                        color: m.status === 'online' ? '#10b981' : m.status === 'away' ? '#f59e0b' : '#64748b',
                        border: `1px solid ${m.status === 'online' ? 'rgba(16,185,129,0.2)' : m.status === 'away' ? 'rgba(245,158,11,0.2)' : 'rgba(100,116,139,0.2)'}`,
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        {m.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div>
                <h3 style={{ margin: '0 0 6px', color: 'var(--text-primary)', fontFamily: 'Syne', fontWeight: 700, fontSize: 17 }}>AI Co-Pilot Settings</h3>
                <p style={{ margin: '0 0 24px', color: 'var(--text-muted)', fontSize: 13 }}>Configure how the AI assistant handles tickets.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <SettingRow label="Drafting Assistance" description="Allow AI to draft initial ticket replies for staff review" toggle checked={toggles.drafting} onChange={setToggle('drafting')} />
                  <SettingRow label="Auto-Categorization" description="Use NLP to automatically sort and tag incoming tickets" toggle checked={toggles.autocategorize} onChange={setToggle('autocategorize')} />
                  <SettingRow label="Sentiment Analysis" description="Flag tickets with frustrated or urgent tone as high priority" toggle checked={toggles.sentiment} onChange={setToggle('sentiment')} />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}