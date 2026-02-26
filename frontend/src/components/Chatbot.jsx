import { useState, useRef, useEffect } from 'react';

const IconBot = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
    <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
  </svg>
);
const IconSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
  </svg>
);
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m the FailSafe AI. How can I help with museum IT today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Analyzing ticket context... The issue in the North Gallery likely stems from a DHCP conflict on VLAN 4. I recommend checking the switch port configuration first.`
      }]);
    }, 1400);
  };

  const chips = ['Summarize Ticket', 'Draft Reply', 'Check VLAN', 'Network Scan'];

  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, fontFamily: 'DM Sans, sans-serif' }}>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: 360, height: 500,
          background: 'var(--modal-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          marginBottom: 16,
          animation: 'slideUp 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 18px',
            background: 'rgba(37,99,235,0.08)',
            borderBottom: '1px solid var(--divider)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 32, height: 32, background: '#2563eb', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
              <IconBot />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Syne', lineHeight: 1 }}>FailSafe AI</div>
              <div style={{ fontSize: 10, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 2s infinite' }} />
                Online
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: 6, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <IconClose />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                fontSize: 13, lineHeight: 1.55,
                background: m.role === 'user' ? '#2563eb' : 'var(--card-bg)',
                color: m.role === 'user' ? 'white' : 'var(--text-primary)',
                border: m.role === 'user' ? 'none' : '1px solid var(--card-border)',
                animation: 'fadeInUp 0.25s ease',
              }}>
                {m.content}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{
                alignSelf: 'flex-start', padding: '10px 14px', borderRadius: '14px 14px 14px 4px',
                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                display: 'flex', gap: 4, alignItems: 'center',
                animation: 'fadeInUp 0.25s ease',
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: `bounce 1.2s ease ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}
          </div>

          {/* Chips */}
          <div style={{ padding: '0 14px 10px', display: 'flex', gap: 6, overflowX: 'auto' }}>
            {chips.map(chip => (
              <button key={chip} onClick={() => setInput(chip)} style={{
                flexShrink: 0, padding: '5px 11px', borderRadius: 20,
                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)'; e.currentTarget.style.color = '#3b82f6'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--divider)', display: 'flex', gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask for IT assistance..."
              className="input-dark"
              style={{ flex: 1, borderRadius: 10, padding: '9px 13px', fontSize: 13 }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                width: 36, height: 36, borderRadius: 10, background: input.trim() ? '#2563eb' : 'var(--card-bg)',
                border: input.trim() ? 'none' : '1px solid var(--card-border)',
                color: input.trim() ? 'white' : 'var(--text-muted)',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
              }}
            >
              <IconSend />
            </button>
          </div>
        </div>
      )}

      {/* FAB trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 54, height: 54, borderRadius: 16,
          background: isOpen ? 'var(--slate)' : '#2563eb',
          border: 'none', color: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isOpen ? 'none' : '0 8px 28px rgba(37,99,235,0.4)',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08) translateY(-3px)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
      >
        {isOpen ? <IconClose /> : <IconBot />}
      </button>

      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)} }
      `}</style>
    </div>
  );
}