import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notifications as mockNotifications } from '../../data/mockData';
import CommandPalette from '../ui/CommandPalette';
import NotificationPanel from '../ui/NotificationPanel';
import KeyboardShortcuts from '../ui/KeyboardShortcuts';
import Badge from '../ui/Badge';

const pageTitles = {
  '/dashboard': 'Overview',
  '/dashboard/automations': 'Automations',
  '/dashboard/templates': 'Templates',
  '/dashboard/logs': 'Logs',
  '/dashboard/api-keys': 'API Keys',
  '/dashboard/usage': 'Usage',
  '/dashboard/webhooks': 'Webhooks',
  '/dashboard/billing': 'Billing',
  '/dashboard/referrals': 'Referrals',
  '/dashboard/settings': 'Settings',
  '/dashboard/audit': 'Audit Log',
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const light = theme === 'light';
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifs, setNotifs] = useState(mockNotifications);
  const [usagePct] = useState(80);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setPaletteOpen(true); }
      if (e.key === '?' && !e.target.closest('input,textarea')) setShortcutsOpen(true);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!user) return null;

  const title = pageTitles[location.pathname] || 'Dashboard';
  const unread = notifs.filter(n => !n.read).length;

  const bannerColor = usagePct >= 100 ? '#FF4466' : usagePct >= 95 ? '#FF4466' : usagePct >= 80 ? '#FFB020' : null;
  const bannerMsg = usagePct >= 100 ? 'Automation limit reached. All automations are paused.'
    : usagePct >= 95 ? "You're almost out of automations this month. Automations will pause when you hit your limit."
    : usagePct >= 80 ? "You've used 80% of your monthly automations. Upgrade to avoid interruptions."
    : null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 220, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {bannerMsg && (
          <div style={{ padding: '8px 24px', fontSize: 13, background: `${bannerColor}15`, borderBottom: `1px solid ${bannerColor}30`, color: bannerColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{bannerMsg}</span>
            <button onClick={() => navigate('/dashboard/billing')} style={{ background: 'none', border: 'none', color: bannerColor, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Upgrade now</button>
          </div>
        )}

        <header style={{
          height: 56, padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`,
          background: light ? '#FFFFFF' : '#0A0A0F',
        }}>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: light ? '#0A0A0F' : '#F0F0F5' }}>{title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setPaletteOpen(true)} aria-label="Search"
              style={{ background: light ? '#F4F4F8' : '#0F0F17', border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, borderRadius: 6, padding: '5px 12px', fontSize: 12, color: light ? '#9090A8' : '#3A3A5A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)' }}>
              Search... <kbd style={{ fontSize: 10, opacity: 0.5 }}>⌘K</kbd>
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifications" style={{ background: 'none', border: 'none', color: light ? '#505070' : '#7070A0', position: 'relative', padding: 4, display: 'flex' }}>
                <Bell size={18} />
                {unread > 0 && <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: '#00E5CC' }} />}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: light ? '#0A0A0F' : '#F0F0F5', padding: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1E1E2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#00E5CC' }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <ChevronDown size={14} />
              </button>
              {userMenuOpen && (
                <div onClick={() => setUserMenuOpen(false)} style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8,
                  background: light ? '#FFFFFF' : '#141420', border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`,
                  borderRadius: 8, padding: 4, width: 160, zIndex: 50,
                }}>
                  {[
                    { icon: User, label: 'Profile', action: () => navigate('/dashboard/settings') },
                    { icon: Settings, label: 'Settings', action: () => navigate('/dashboard/settings') },
                    { icon: LogOut, label: 'Sign out', action: () => { logout(); navigate('/'); } },
                  ].map(item => (
                    <button key={item.label} onClick={item.action} style={{
                      display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px',
                      background: 'none', border: 'none', fontSize: 13, color: item.label === 'Sign out' ? '#FF4466' : light ? '#0A0A0F' : '#F0F0F5',
                      borderRadius: 4, textAlign: 'left',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = light ? '#F4F4F8' : '#0F0F17'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <item.icon size={14} />{item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: 28, overflow: 'auto', background: light ? '#FAFAFA' : '#0A0A0F' }}>
          <Outlet />
        </main>
      </div>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} notifications={notifs} setNotifications={setNotifs} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <KeyboardShortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
