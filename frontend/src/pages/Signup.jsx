import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);
const IconSpinner = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.7s linear infinite' }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
const IconCheck = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
  </svg>
);

function FieldGroup({ label, error, children }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 700,
        color: 'rgba(255,255,255,0.35)', marginBottom: 8,
        textTransform: 'uppercase', letterSpacing: '0.14em',
        fontFamily: 'DM Sans, sans-serif',
      }}>{label}</label>
      {children}
      {error && <p style={{ color: '#f9a8b4', fontSize: 11, margin: '5px 0 0', fontFamily: 'DM Sans' }}>{error}</p>}
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', employeeId: '', department: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState('');

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const inputStyle = (name, hasError) => ({
    width: '100%', padding: '12px 14px', borderRadius: 8, fontSize: 14,
    fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box',
    background: focused === name ? 'rgba(37,99,235,0.06)' : hasError ? 'rgba(244,63,94,0.05)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${hasError ? 'rgba(244,63,94,0.3)' : focused === name ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.09)'}`,
    color: '#ffffff', outline: 'none', transition: 'all 0.22s ease',
    boxShadow: focused === name && !hasError ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none',
  });

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.lastName.trim()) e.lastName = 'Required';
    if (!formData.email.trim()) e.email = 'Required';
    else if (!formData.email.endsWith('@crystalbridges.org')) e.email = 'Must use @crystalbridges.org';
    if (!formData.employeeId.trim()) e.employeeId = 'Required';
    if (!formData.department) e.department = 'Required';
    if (!formData.password) e.password = 'Required';
    else if (formData.password.length < 8) e.password = 'Minimum 8 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/auth/signup', formData);
      setFormStep(1);
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  // SUCCESS
  if (formStep === 1) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.25 }}>
          <source src="/photo/real.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 420, width: '100%', textAlign: 'center', animation: 'popIn 0.5s cubic-bezier(0.4,0,0.2,1) forwards' }}>
          <div style={{ width: 76, height: 76, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(16,185,129,0.15)' }}>
            <IconCheck />
          </div>
          <p style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#3b82f6', letterSpacing: '0.28em', textTransform: 'uppercase', margin: '0 0 12px', fontWeight: 700 }}>Crystal Bridges</p>
          <h2 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, color: '#ffffff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>Request Submitted</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', margin: '12px 0 18px' }}>
            <div style={{ width: 24, height: 1, background: 'rgba(59,130,246,0.3)' }} />
            <div style={{ width: 4, height: 4, background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 6px rgba(59,130,246,0.5)' }} />
            <div style={{ width: 24, height: 1, background: 'rgba(59,130,246,0.3)' }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 6px', lineHeight: 1.7, fontSize: 13, fontFamily: 'DM Sans' }}>Your access request has been sent to the IT admin for review.</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0 36px', fontSize: 12, fontFamily: 'DM Sans' }}>
            You'll hear back at <span style={{ color: '#3b82f6', fontWeight: 600 }}>{formData.email}</span>
          </p>
          <button onClick={() => navigate('/login')} style={{
            width: '100%', padding: '13px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: '#fff',
            fontSize: 13, fontFamily: 'Syne', fontWeight: 700, letterSpacing: '0.04em',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 0 24px rgba(37,99,235,0.3)', transition: 'all 0.25s',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 40px rgba(37,99,235,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(37,99,235,0.3)'; e.currentTarget.style.transform = 'none'; }}
          >
            Return to Portal <IconArrow />
          </button>
        </div>
        <style>{`
          @keyframes popIn { from{opacity:0;transform:scale(0.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)} }
          @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        `}</style>
      </div>
    );
  }

  // MAIN FORM
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>

      <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
        <source src="/photo/real.mp4" type="video/mp4" />
      </video>

      {/* Same overlays as Login */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse at 40% 50%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '38%', height: '38%', zIndex: 2, background: 'radial-gradient(ellipse at top left, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 45%, transparent 72%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: '38%', height: '38%', zIndex: 2, background: 'radial-gradient(ellipse at top right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 45%, transparent 72%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '38%', height: '38%', zIndex: 2, background: 'radial-gradient(ellipse at bottom left, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 45%, transparent 72%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '45%', height: '45%', zIndex: 2, background: 'radial-gradient(ellipse at bottom right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 25%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 68%, transparent 80%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '18%', zIndex: 2, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)', pointerEvents: 'none' }} />

      <div style={{
        maxWidth: 540, width: '100%', position: 'relative', zIndex: 5,
        opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Header — matches Login exactly */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#3b82f6', letterSpacing: '0.28em', textTransform: 'uppercase', margin: '0 0 12px', fontWeight: 700, textShadow: '0 0 20px rgba(59,130,246,0.4)' }}>
            Crystal Bridges Museum of American Art
          </p>
          <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: '#ffffff', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Request Access
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 6 }}>
            <div style={{ width: 24, height: 1, background: 'rgba(59,130,246,0.3)' }} />
            <div style={{ width: 4, height: 4, background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 8px rgba(59,130,246,0.5)' }} />
            <div style={{ width: 24, height: 1, background: 'rgba(59,130,246,0.3)' }} />
          </div>
          <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            IT Operations Portal
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(5,7,14,0.92)', border: '1px solid rgba(59,130,246,0.12)',
          borderRadius: 4, padding: '36px 40px',
          backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
          boxShadow: '0 48px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>

          {errors.submit && (
            <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#f9a8b4', fontSize: 12, fontFamily: 'DM Sans', animation: 'shake 0.3s ease' }}>
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FieldGroup label="First Name *" error={errors.firstName}>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} onFocus={() => setFocused('firstName')} onBlur={() => setFocused('')} style={inputStyle('firstName', !!errors.firstName)} />
              </FieldGroup>
              <FieldGroup label="Last Name *" error={errors.lastName}>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} onFocus={() => setFocused('lastName')} onBlur={() => setFocused('')} style={inputStyle('lastName', !!errors.lastName)} />
              </FieldGroup>
            </div>

            <FieldGroup label="Crystal Bridges Email *" error={errors.email}>
              <input type="email" name="email" value={formData.email} onChange={handleChange} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} placeholder="you@crystalbridges.org" style={inputStyle('email', !!errors.email)} />
            </FieldGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FieldGroup label="Employee ID *" error={errors.employeeId}>
                <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} onFocus={() => setFocused('employeeId')} onBlur={() => setFocused('')} placeholder="CB-12345" style={inputStyle('employeeId', !!errors.employeeId)} />
              </FieldGroup>
              <FieldGroup label="Department *" error={errors.department}>
                <select name="department" value={formData.department} onChange={handleChange} onFocus={() => setFocused('department')} onBlur={() => setFocused('')} style={{ ...inputStyle('department', !!errors.department), cursor: 'pointer' }}>
                  <option value="" style={{ background: '#05070e' }}>Select...</option>
                  <option value="IT" style={{ background: '#05070e' }}>IT Department</option>
                  <option value="Operations" style={{ background: '#05070e' }}>Operations</option>
                  <option value="Facilities" style={{ background: '#05070e' }}>Facilities</option>
                  <option value="Administration" style={{ background: '#05070e' }}>Administration</option>
                  <option value="Curatorial" style={{ background: '#05070e' }}>Curatorial</option>
                  <option value="Education" style={{ background: '#05070e' }}>Education</option>
                </select>
              </FieldGroup>
            </div>

            <FieldGroup label="Phone (Optional)">
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onFocus={() => setFocused('phone')} onBlur={() => setFocused('')} placeholder="(479) 555-0123" style={inputStyle('phone', false)} />
            </FieldGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FieldGroup label="Password *" error={errors.password}>
                <input type="password" name="password" value={formData.password} onChange={handleChange} onFocus={() => setFocused('password')} onBlur={() => setFocused('')} placeholder="Min 8 characters" style={inputStyle('password', !!errors.password)} />
              </FieldGroup>
              <FieldGroup label="Confirm Password *" error={errors.confirmPassword}>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused('')} placeholder="Re-enter password" style={inputStyle('confirmPassword', !!errors.confirmPassword)} />
              </FieldGroup>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: 8, border: 'none', marginTop: 4,
              background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: '#fff',
              fontSize: 13, fontFamily: 'Syne', fontWeight: 700, letterSpacing: '0.04em',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 0 24px rgba(37,99,235,0.3)', transition: 'all 0.25s',
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 0 40px rgba(37,99,235,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(37,99,235,0.3)'; e.currentTarget.style.transform = 'none'; }}
            >
              {loading ? <><IconSpinner /> Submitting...</> : <>Request Access <IconArrow /></>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, margin: 0, fontFamily: 'DM Sans' }}>
              Already have access?{' '}
              <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'}
                onMouseLeave={e => e.currentTarget.style.color = '#3b82f6'}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Bentonville badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 100, padding: '5px 16px', backdropFilter: 'blur(14px)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px rgba(59,130,246,0.5)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Bentonville · Arkansas
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        @keyframes shake { 0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)} }
        input::placeholder { color: rgba(255,255,255,0.18); }
        select option { background: #05070e; color: #fff; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}