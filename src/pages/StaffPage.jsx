import { useState, useEffect } from 'react';
import { getAdmins, createAdmin, deleteAdmin } from '../lib/api';

export default function StaffPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    try {
      const data = await getAdmins();
      setAdmins(data.admins);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');
    try {
      await createAdmin({ email, password });
      setSuccess(`Admin ${email} created successfully`);
      setEmail('');
      setPassword('');
      loadAdmins();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(emailToDelete) {
    if (!window.confirm(`Are you sure you want to revoke admin access for ${emailToDelete}?`)) return;
    try {
      await deleteAdmin(emailToDelete);
      setSuccess(`Access revoked for ${emailToDelete}`);
      loadAdmins();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="page-loading"><span className="blink">▋</span> Loading staff...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Staff Management</h2>
        <span className="page-ts">{admins.length} authorized admins</span>
      </div>

      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Invite New Admin</h3>
        </div>
        <div className="panel" style={{ padding: '32px' }}>
          <form onSubmit={handleCreate} className="login-form" style={{ marginTop: 0, maxWidth: '400px' }}>
            <div className="field">
              <label>EMAIL</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="new.admin@pantrio.com" required />
            </div>
            <div className="field">
              <label>TEMPORARY PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <div className="login-error">{error}</div>}
            {success && <div className="badge badge-plan" style={{ marginTop: '16px', padding: '12px', display: 'block', textAlign: 'center' }}>{success}</div>}
            <button type="submit" className="login-btn" disabled={creating} style={{ marginTop: '24px' }}>
              {creating ? 'CREATING...' : 'AUTHORIZE ADMIN →'}
            </button>
          </form>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Current Administrators</h3>
        </div>
        <div className="panel event-table-wrap">
          <table className="event-table">
            <thead>
              <tr>
                <th>EMAIL</th>
                <th>AUTHORIZED ON</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  <td className="mono">{admin.email}</td>
                  <td className="mono small muted">{new Date(admin.created_at).toLocaleDateString('en-GB')}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete(admin.email)}
                      className="badge-default badge" 
                      style={{ cursor: 'pointer', color: 'var(--error)', borderColor: 'rgba(217, 96, 96, 0.2)' }}
                    >
                      REVOKE ACCESS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
