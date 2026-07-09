import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, ScrollText, Key, BarChart2, Webhook, CreditCard, Settings, ChevronLeft, ChevronRight, Layers, Gift, Shield, Sun, Moon } from 'lucide-react';
import { NuroMark } from '../ui/NuroLogo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Badge from '../ui/Badge';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { path: '/dashboard/automations', icon: Zap, label: 'Automations' },
  { path: '/dashboard/templates', icon: Layers, label: 'Templates' },
  { path: '/dashboard/logs', icon: ScrollText, label: 'Logs' },
  { path: '/dashboard/api-keys', icon: Key, label: 'API Keys' },
  { path: '/dashboard/usage', icon: BarChart2, label: 'Usage' },
  { path: '/dashboard/webhooks', icon: Webhook, label: 'Webhooks' },
  { path: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  { path: '/dashboard/referrals', icon: Gift, label: 'Referrals' },
  { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  { path: '/dashboard/audit', icon: Shield, label: 'Audit Log' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const light = theme === 'light';
  const width = collapsed ? 64 : 220;

  return (
    <aside style={{
      width, minWidth: width, height: '100vh', position: 'fixed', left: 0, top: 0,
      background: light ? '#FFFFFF' : '#0A0A0F',
      borderRight: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`,
      display: 'flex', flexDirection: 'column', transition: 'width 200ms ease',
      zIndex: 50, overflow: 'hidden',
    }}>
      <div style={{ padding: collapsed ? '20px 16px' : '20px 16px', display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <NuroMark size={28} />
        {!collapsed && <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -2, color: light ? '#0A0A0F' : '#F0F0F5' }}>nuro</span>}
      </div>

      <nav style={{ flex: 1, padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} title={collapsed ? item.label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '10px 0' : '8px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 6, fontSize: 13, fontWeight: active ? 500 : 400,
                color: active ? '#00E5CC' : light ? '#505070' : '#7070A0',
                background: active ? 'rgba(0,229,204,0.08)' : 'transparent',
                borderLeft: active ? '2px solid #00E5CC' : '2px solid transparent',
                transition: 'all 200ms',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = light ? '#F4F4F8' : 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={16} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '12px 8px', borderTop: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={toggle} aria-label="Toggle theme"
          style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : 'flex-start', padding: '8px 12px', background: 'none', border: 'none', color: light ? '#505070' : '#7070A0', fontSize: 13, width: '100%', borderRadius: 6 }}>
          {light ? <Moon size={16} /> : <Sun size={16} />}
          {!collapsed && <span>{light ? 'Dark mode' : 'Light mode'}</span>}
        </button>
        <button onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : 'flex-start', padding: '8px 12px', background: 'none', border: 'none', color: light ? '#505070' : '#7070A0', fontSize: 13, width: '100%', borderRadius: 6 }}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: collapsed ? '8px 0' : '8px 12px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1E1E2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#00E5CC', flexShrink: 0 }}>
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: light ? '#0A0A0F' : '#F0F0F5', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</div>
                <Badge type={user.plan?.toLowerCase()}>{user.plan}</Badge>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
