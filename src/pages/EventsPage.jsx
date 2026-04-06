import { useState, useEffect } from 'react';
import { getRecentEvents } from '../lib/api';

const EVENT_BADGE = {
  plan_generated:      { label: 'PLAN GEN',  cls: 'badge-plan' },
  grocery_link_clicked: { label: 'GROCERY',   cls: 'badge-grocery' },
};

function timeSince(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (days  > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins  > 0) return `${mins}m ago`;
  return 'just now';
}

export default function EventsPage() {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  const [error,   setError]   = useState('');

  useEffect(() => {
    getRecentEvents(100)
      .then(({ events }) => { setEvents(events); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const filtered = filter === 'all' ? events : events.filter(e => e.event_name === filter);

  if (loading) return <div className="page-loading"><span className="blink">▋</span> Loading events...</div>;
  if (error)   return <div className="page-error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Events Feed</h2>
        <span className="page-ts">{events.length} total events</span>
      </div>

      <div className="filter-row">
        {['all', 'plan_generated', 'grocery_link_clicked'].map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'ALL' : EVENT_BADGE[f]?.label ?? f.toUpperCase()}
          </button>
        ))}
        <span className="filter-count">{filtered.length} shown</span>
      </div>

      <div className="panel event-table-wrap">
        <table className="event-table">
          <thead>
            <tr>
              <th>TYPE</th>
              <th>USER</th>
              <th>DETAIL</th>
              <th>TIME</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => {
              const badge = EVENT_BADGE[e.event_name] ?? { label: e.event_name, cls: 'badge-default' };
              const detail = e.event_name === 'plan_generated'
                ? e.metadata?.plan_name ?? '—'
                : e.metadata?.item_name ?? '—';
              return (
                <tr key={e.id}>
                  <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                  <td className="mono small">{e.user_email}</td>
                  <td className="detail-cell">{detail}</td>
                  <td className="mono small muted">{timeSince(e.created_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty-state">No events found.</p>}
      </div>
    </div>
  );
}
