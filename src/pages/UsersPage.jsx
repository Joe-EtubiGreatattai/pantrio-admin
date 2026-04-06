import { useState, useEffect } from 'react';
import { getUsers } from '../lib/api';

export default function UsersPage() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [error,   setError]   = useState('');

  useEffect(() => {
    getUsers()
      .then(({ users }) => { setUsers(users); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="page-loading"><span className="blink">▋</span> Loading users...</div>;
  if (error)   return <div className="page-error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Users</h2>
        <span className="page-ts">{users.length} total</span>
      </div>

      <div className="search-row">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className="search-input"
          placeholder="Search by email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="panel event-table-wrap">
        <table className="event-table">
          <thead>
            <tr>
              <th>EMAIL</th>
              <th>STATUS</th>
              <th>PLANS</th>
              <th>LAST SIGN IN</th>
              <th>JOINED</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td className="mono">{u.email}</td>
                <td>
                  <span className={`badge ${u.confirmed ? 'badge-plan' : 'badge-default'}`}>
                    {u.confirmed ? 'CONFIRMED' : 'PENDING'}
                  </span>
                </td>
                <td className="mono">{u.plan_count}</td>
                <td className="mono small muted">
                  {u.last_sign_in ? new Date(u.last_sign_in).toLocaleDateString('en-GB') : '—'}
                </td>
                <td className="mono small muted">
                  {new Date(u.created_at).toLocaleDateString('en-GB')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty-state">No users found.</p>}
      </div>
    </div>
  );
}
