import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: '#0A0A0F' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 72, fontWeight: 700, color: '#1E1E2E', letterSpacing: -4 }}>404</span>
      <p style={{ fontSize: 14, color: '#7070A0', marginTop: 12 }}>This page doesn't exist.</p>
      <Link to="/" style={{ fontSize: 13, color: '#00E5CC', marginTop: 16 }}>Go home</Link>
    </div>
  );
}
