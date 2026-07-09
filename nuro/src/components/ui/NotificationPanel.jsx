import { AnimatePresence, motion } from 'framer-motion';
import { X, Zap, AlertTriangle, CreditCard, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const icons = { Zap, AlertTriangle, CreditCard, Users };

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationPanel({ open, onClose, notifications, setNotifications }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const light = theme === 'light';

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const tabs = ['All', 'Unread', 'System'];
  const [activeTab, setActiveTab] = [tabs[0], () => {}];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.3)' }} />
          <motion.div
            initial={{ x: 360 }} animate={{ x: 0 }} exit={{ x: 360 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0, width: 360, zIndex: 61,
              background: light ? '#FFFFFF' : '#0A0A0F',
              borderLeft: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`,
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: light ? '#0A0A0F' : '#F0F0F5' }}>Notifications</h3>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button onClick={markAllRead} style={{ background: 'none', border: 'none', fontSize: 12, color: '#00E5CC', cursor: 'pointer' }}>Mark all read</button>
                <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: light ? '#505070' : '#7070A0', padding: 2 }}><X size={16} /></button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {notifications.length === 0 ? (
                <p style={{ padding: 40, textAlign: 'center', fontSize: 13, color: '#3A3A5A', fontFamily: 'var(--font-mono)' }}>{'>'} No notifications yet</p>
              ) : notifications.map(n => {
                const Icon = icons[n.icon] || Zap;
                return (
                  <button key={n.id} onClick={() => {
                    setNotifications(notifications.map(x => x.id === n.id ? { ...x, read: true } : x));
                    navigate(n.link);
                    onClose();
                  }} style={{
                    display: 'flex', gap: 12, padding: '14px 20px', width: '100%', textAlign: 'left',
                    background: n.read ? 'transparent' : light ? '#F4F4F8' : 'rgba(0,229,204,0.03)',
                    border: 'none', borderBottom: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`,
                    cursor: 'pointer', transition: 'background 200ms',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = light ? '#F4F4F8' : 'rgba(255,255,255,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = n.read ? 'transparent' : light ? '#F4F4F8' : 'rgba(0,229,204,0.03)'}
                  >
                    <Icon size={16} style={{ color: '#7070A0', marginTop: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: n.read ? 400 : 500, color: light ? '#0A0A0F' : '#F0F0F5' }}>{n.title}</span>
                        {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00E5CC', flexShrink: 0 }} />}
                      </div>
                      <p style={{ fontSize: 12, color: light ? '#505070' : '#7070A0', marginTop: 2, lineHeight: 1.4 }}>{n.body}</p>
                      <span style={{ fontSize: 11, color: light ? '#9090A8' : '#3A3A5A', marginTop: 4, display: 'block' }}>{timeAgo(n.timestamp)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ padding: '12px 20px', borderTop: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}` }}>
              <button onClick={() => { navigate('/dashboard/settings'); onClose(); }} style={{ background: 'none', border: 'none', fontSize: 12, color: '#00E5CC', cursor: 'pointer' }}>
                Notification preferences
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
