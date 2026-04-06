import { useState, useEffect } from 'react';
import { getStats, getEventsByDay, getTopItems } from '../lib/api';

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`stat-card ${accent ? 'accent' : ''}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value ?? '—'}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function ActivityChart({ days }) {
  if (!days?.length) return null;
  const maxVal = Math.max(...days.map(d => d.plan_generated + d.grocery_link_clicked), 1);

  return (
    <div className="chart-wrap">
      <div className="chart-bars">
        {days.map((d, i) => (
          <div key={i} className="chart-col">
            <div className="chart-bar-group">
              <div className="chart-bar bar-plans"
                style={{ height: `${(d.plan_generated / maxVal) * 100}%` }}
                title={`Plans: ${d.plan_generated}`}
              />
              <div className="chart-bar bar-clicks"
                style={{ height: `${(d.grocery_link_clicked / maxVal) * 100}%` }}
                title={`Clicks: ${d.grocery_link_clicked}`}
              />
            </div>
            {i % 2 === 0 && <div className="chart-date">{d.date.slice(5)}</div>}
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <span><i className="leg-dot plans" />Plans Generated</span>
        <span><i className="leg-dot clicks" />Grocery Clicks</span>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [stats,    setStats]    = useState(null);
  const [days,     setDays]     = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [error,    setError]    = useState('');

  useEffect(() => {
    Promise.all([getStats(), getEventsByDay(14), getTopItems()])
      .then(([s, d, t]) => {
        setStats(s);
        setDays(d.days);
        setTopItems(t.items);
      })
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Overview</h2>
        <span className="page-ts">{new Date().toLocaleString('en-GB')}</span>
      </div>

      <div className="stat-grid">
        <StatCard label="TOTAL USERS"       value={stats?.total_users}      sub="registered accounts" accent />
        <StatCard label="PLANS GENERATED"   value={stats?.total_plans}      sub="all time" />
        <StatCard label="AI GENERATIONS"    value={stats?.plan_generations}  sub="tracked events" />
        <StatCard label="GROCERY CLICKS"    value={stats?.grocery_clicks}    sub="tesco link clicks" />
      </div>

      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Activity — Last 14 Days</h3>
        </div>
        <div className="panel">
          <ActivityChart days={days} />
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Top Grocery Items</h3>
        </div>
        <div className="panel">
          {topItems.length === 0 ? (
            <p className="empty-state">No data yet.</p>
          ) : (
            <div className="item-bars">
              {topItems.map((item, i) => {
                const max = topItems[0].count;
                return (
                  <div key={i} className="item-bar-row">
                    <span className="item-rank">#{String(i + 1).padStart(2, '0')}</span>
                    <span className="item-name">{item.name}</span>
                    <div className="item-track">
                      <div className="item-fill" style={{ width: `${(item.count / max) * 100}%` }} />
                    </div>
                    <span className="item-count">{item.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
