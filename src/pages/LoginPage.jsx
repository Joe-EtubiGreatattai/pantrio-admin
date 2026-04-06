import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate   = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) { setError(err.message); return; }
    navigate('/');
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="brand-tag">SYSTEM</span>
          <h1>PANTRIO</h1>
          <p>Control Room</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label>EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@pantrio.com" required autoComplete="email" />
          </div>
          <div className="field">
            <label>PASSWORD</label>
            <div className="input-reveal">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required />
              <button type="button" className="reveal-btn" onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <><span className="dot-blink" />AUTHENTICATING</> : 'SIGN IN →'}
          </button>
        </form>

        <p className="login-note">Admin access only. Unauthorised access is monitored.</p>
      </div>
    </div>
  );
}
