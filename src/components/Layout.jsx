import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';

const NAV = [
  { to: '/',       label: 'Overview',  icon: '◈' },
  { to: '/events', label: 'Events',    icon: '◉' },
  { to: '/users',  label: 'Users',     icon: '◎' },
  { to: '/staff',  label: 'Staff',     icon: '✧' },
];

export default function Layout({ children }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-tag">ADMIN</span>
          <span className="sidebar-logo">PANTRIO</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="status-dot" />
            <span className="sidebar-email">{user?.email}</span>
          </div>
          <button className="sign-out-btn" onClick={handleSignOut}>SIGN OUT</button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
