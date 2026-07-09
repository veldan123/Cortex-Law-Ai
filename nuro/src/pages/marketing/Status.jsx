import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

const components = [
  { name: 'API', status: 'operational', uptime: 99.98 },
  { name: 'Automation Engine', status: 'operational', uptime: 99.95 },
  { name: 'Webhook Delivery', status: 'operational', uptime: 99.97 },
  { name: 'Dashboard', status: 'operational', uptime: 99.99 },
  { name: 'Email Delivery', status: 'operational', uptime: 99.92 },
];

export default function Status() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const light = theme === 'light';
  const [email, setEmail] = useState('');
  const text = light ? '#0A0A0F' : '#F0F0F5';
  const secondary = light ? '#505070' : '#7070A0';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const border = light ? '#E0E0EC' : '#1E1E2E';
  const bg = light ? '#FFFFFF' : '#0A0A0F';
  const bgAlt = light ? '#F4F4F8' : '#0F0F17';

  const allOperational = components.every(c => c.status === 'operational');

  return (
    <div style={{ background: light ? '#FAFAFA' : '#0A0A0F', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '120px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: allOperational ? '#00E5CC' : '#FFB020' }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: text }}>
            {allOperational ? 'All systems operational' : 'Partial degradation'}
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {components.map(c => (
            <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${border}` }}>
              <span style={{ fontSize: 14, color: text }}>{c.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: muted }}>{c.uptime}% uptime</span>
                <span style={{ fontSize: 12, color: '#00E5CC', fontWeight: 500 }}>Operational</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: 16 }}>Incident history</h2>
          {[...Array(5)].map((_, i) => {
            const d = new Date(); d.setDate(d.getDate() - i);
            return (
              <div key={i} style={{ padding: '12px 0', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: secondary }}>{d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span style={{ fontSize: 12, color: muted }}>No incidents</span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 48, padding: 24, background: bgAlt, border: `1px solid ${border}`, borderRadius: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: text, marginBottom: 8 }}>Subscribe to updates</h3>
          <form onSubmit={(e) => { e.preventDefault(); addToast('Subscribed to status updates', 'success'); setEmail(''); }} style={{ display: 'flex', gap: 8 }}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="your@email.com"
              style={{ flex: 1, background: light ? '#FFFFFF' : '#0A0A0F', border: `1px solid ${border}`, borderRadius: 6, padding: '8px 12px', fontSize: 13, color: text, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
            <button type="submit" style={{ background: '#00E5CC', color: '#0A0A0F', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 500 }}>Subscribe</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
