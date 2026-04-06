import { supabase } from './supabase';

const BASE = import.meta.env.VITE_API_URL || 'https://pantrio-server.onrender.com';

async function adminHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token}`,
  };
}

async function get(path) {
  const res = await fetch(`${BASE}/api/admin${path}`, { headers: await adminHeaders() });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export const getStats = () => get('/stats');
export const getRecentEvents = (limit = 50) => get(`/events?limit=${limit}`);
export const getEventsByDay = (days = 14) => get(`/events/day?days=${days}`);
export const getTopItems = () => get('/items/top');
export const getUsers = () => get('/users');
export const getAdmins     = ()           => get('/admins');
export const createAdmin     = (data)       => post('/admins', data);
export const deleteAdmin     = (email)      => del(`/admins/${email}`);

async function post(path, body) {
  const res = await fetch(`${BASE}/api/admin${path}`, {
    method: 'POST',
    headers: await adminHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

async function del(path) {
  const res = await fetch(`${BASE}/api/admin${path}`, {
    method: 'DELETE',
    headers: await adminHeaders(),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}
