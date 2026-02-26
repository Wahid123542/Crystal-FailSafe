import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#000' }}>

      {/* Video */}
      <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
        <source src="/photo/real.mp4" type="video/mp4" />
      </video>

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse at 40% 50%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '38%', height: '38%', zIndex: 2, background: 'radial-gradient(ellipse at top left, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 45%, transparent 72%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: '38%', height: '38%', zIndex: 2, background: 'radial-gradient(ellipse at top right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 45%, transparent 72%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '38%', height: '38%', zIndex: 2, background: 'radial-gradient(ellipse at bottom left, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 45%, transparent 72%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '45%', height: '45%', zIndex: 2, background: 'radial-gradient(ellipse at bottom right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 25%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 68%, transparent 80%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '18%', zIndex: 2, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)', pointerEvents: 'none' }} />

      {/* Landing */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        opacity: formVisible ? 0 : 1,
        transform: formVisible ? 'translateY(-16px)' : 'translateY(0)',
        pointerEvents: formVisible ? 'none' : 'auto',
        padding: '0 24px',
      }}>
        {/* Label */}
        <p style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(13px, 1.5vw, 17px)',
          fontWeight: 800, color: '#ffffff',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          margin: '0 0 18px',
          textShadow: '0 0 30px rgba(255,255,255,0.25)',
        }}>
          Crystal Bridges Museum of American Art
        </p>

        {/* White title */}
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 'clamp(52px, 9vw, 104px)',
          fontWeight: 800, color: '#ffffff', margin: 0,
          lineHeight: 1, letterSpacing: '-0.03em',
          textShadow: '0 2px 40px rgba(0,0,0,0.4)',
        }}>
          FailSafe
        </h1>

        {/* Blue ornament */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ width: 40, height: 1, background: 'rgba(59,130,246,0.4)' }} />
          <div style={{ width: 5, height: 5, background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 10px rgba(59,130,246,0.6)' }} />
          <div style={{ width: 40, height: 1, background: 'rgba(59,130,246,0.4)' }} />
        </div>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(12px, 1.3vw, 15px)',
          fontWeight: 700, color: 'rgba(255,255,255,0.85)',
          margin: '0 0 52px', letterSpacing: '0.22em', textTransform: 'uppercase',
          textShadow: '0 1px 12px rgba(0,0,0,0.4)',
        }}>
          IT Operations Portal
        </p>

        {/* CTA */}
        <button onClick={() => setFormVisible(true)} style={{
          padding: '13px 48px',
          background: 'rgba(37,99,235,0.15)',
          border: '1px solid rgba(59,130,246,0.5)',
          borderRadius: 4, color: '#ffffff',
          fontSize: 11, fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          cursor: 'pointer', backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 24px rgba(37,99,235,0.2)',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.3)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.9)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(37,99,235,0.45)'; e.currentTarget.style.letterSpacing = '0.24em'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.15)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(37,99,235,0.2)'; e.currentTarget.style.letterSpacing = '0.2em'; }}
        >
          Staff Access
        </button>

        {/* Badge */}
        <div style={{ position: 'absolute', bottom: '8vh', left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: 100, padding: '5px 16px',
            backdropFilter: 'blur(14px)',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px rgba(59,130,246,0.6)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Bentonville · Arkansas
            </span>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {formVisible && (
        <div onClick={() => setFormVisible(false)} style={{
          position: 'absolute', inset: 0, zIndex: 4,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
          animation: 'fadeIn 0.3s ease',
        }} />
      )}

      {/* Modal */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px',
        pointerEvents: formVisible ? 'auto' : 'none',
        transition: 'opacity 0.4s ease, transform 0.45s cubic-bezier(0.34,1.4,0.64,1)',
        opacity: formVisible ? 1 : 0,
        transform: formVisible ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(20px)',
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          width: '100%', maxWidth: 400,
          background: 'rgba(5,7,14,0.92)',
          border: '1px solid rgba(59,130,246,0.15)',
          borderRadius: 4, padding: '44px 40px 36px',
          backdropFilter: 'blur(40px)',
          boxShadow: '0 48px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
          position: 'relative',
        }}>

          <button onClick={() => setFormVisible(false)} style={{
            position: 'absolute', top: 14, right: 14, width: 28, height: 28,
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)',
            cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.2s', borderRadius: 6,
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
          >✕</button>

          {/* Header */}
          <div style={{ marginBottom: 30, textAlign: 'center' }}>
            <p style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#3b82f6', letterSpacing: '0.28em', textTransform: 'uppercase', margin: '0 0 12px', fontWeight: 700 }}>
              Crystal Bridges
            </p>
            <h2 style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 800, color: '#ffffff', margin: '0 0 14px', letterSpacing: '-0.02em' }}>
              Welcome back
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <div style={{ width: 24, height: 1, background: 'rgba(59,130,246,0.3)' }} />
              <div style={{ width: 4, height: 4, background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 6px rgba(59,130,246,0.5)' }} />
              <div style={{ width: 24, height: 1, background: 'rgba(59,130,246,0.3)' }} />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, color: '#f9a8b4', fontSize: 12, fontFamily: 'DM Sans', animation: 'shake 0.3s ease' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@crystalbridges.org' },
              { label: 'Password', name: 'password', type: showPassword ? 'text' : 'password', placeholder: 'Enter your password' },
            ].map((field) => (
              <div key={field.name}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: 'DM Sans' }}>
                  {field.label}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={field.type} name={field.name}
                    value={formData[field.name]} onChange={handleChange}
                    placeholder={field.placeholder} required
                    style={{
                      width: '100%',
                      padding: field.name === 'password' ? '12px 40px 12px 14px' : '12px 14px',
                      borderRadius: 8, fontSize: 14, fontFamily: 'DM Sans',
                      boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      color: '#ffffff', outline: 'none', transition: 'all 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.6)'; e.target.style.background = 'rgba(37,99,235,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none'; }}
                  />
                  {field.name === 'password' && (
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', fontSize: 13, padding: 0, transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                    >
                      {showPassword ? '○' : '●'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'right', marginTop: -4 }}>
              <button type="button" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading} style={{
              padding: '13px', borderRadius: 8, fontSize: 13, fontFamily: 'Syne', fontWeight: 700,
              letterSpacing: '0.04em', marginTop: 4, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, border: 'none',
              background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: '#fff',
              transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 0 24px rgba(37,99,235,0.3)',
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 0 40px rgba(37,99,235,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(37,99,235,0.3)'; e.currentTarget.style.transform = 'none'; }}
            >
              {loading ? (
                <>
                  <svg style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Authenticating...
                </>
              ) : 'Enter Portal'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, margin: 0, fontFamily: 'DM Sans' }}>
              Need access?{' '}
              <button onClick={() => navigate('/signup')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'}
                onMouseLeave={e => e.currentTarget.style.color = '#3b82f6'}
              >
                Request account
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        @keyframes shake { 0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)} }
        input::placeholder { color: rgba(255,255,255,0.18); }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

export default Login;