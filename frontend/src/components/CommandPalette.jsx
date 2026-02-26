import { useState, useRef, useEffect } from 'react';

const IconBot = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;
const IconSend = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am the FailSafe AI. How can I help you with museum IT today?' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI thinking
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I've analyzed the technical logs. The issue with the North Gallery projector usually stems from a DHCP conflict on VLAN 4.` 
      }]);
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, fontFamily: 'DM Sans, sans-serif' }}>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="animate-slide-up" style={{
          width: '360px', height: '500px', background: '#0d1424', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)', marginBottom: '20px'
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', background: 'rgba(37,99,235,0.1)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <IconBot />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#e8edf5', fontFamily: 'Syne' }}>FailSafe AI</div>
              <div style={{ fontSize: '10px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10b981' }} /> Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', padding: '12px 16px', borderRadius: '14px',
                fontSize: '13px', lineHeight: '1.5',
                background: m.role === 'user' ? '#2563eb' : 'rgba(255,255,255,0.05)',
                color: m.role === 'user' ? 'white' : '#e8edf5',
                border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)'
              }}>
                {m.content}
              </div>
            ))}
          </div>

          {/* Prompt Chips */}
          <div style={{ padding: '0 20px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
            {['Summarize Ticket', 'Draft Reply', 'Check VLAN'].map(chip => (
              <button key={chip} onClick={() => setInput(chip)} style={{ 
                flexShrink: 0, padding: '6px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.1)', color: '#8496b0', fontSize: '11px', cursor: 'pointer' 
              }}>
                {chip}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px' }}>
            <input 
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for IT assistance..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '13px', outline: 'none' }}
            />
            <button onClick={handleSend} style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#2563eb', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconSend />
            </button>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px', height: '60px', borderRadius: '20px', background: '#2563eb', border: 'none',
          color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)', transition: 'all 0.3s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
      >
        {isOpen ? <div style={{ fontSize: '24px' }}>×</div> : <IconBot />}
      </button>
    </div>
  );
}