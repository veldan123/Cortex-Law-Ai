import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, LayoutDashboard, Zap, ScrollText, Key, BarChart2, Settings, Plus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { automations } from '../../data/mockData';

const navItems = [
  { category: 'Navigation', icon: LayoutDashboard, label: 'Go to Overview', path: '/dashboard' },
  { category: 'Navigation', icon: Zap, label: 'Go to Automations', path: '/dashboard/automations' },
  { category: 'Navigation', icon: ScrollText, label: 'Go to Logs', path: '/dashboard/logs' },
  { category: 'Navigation', icon: Key, label: 'Go to API Keys', path: '/dashboard/api-keys' },
  { category: 'Navigation', icon: BarChart2, label: 'Go to Usage', path: '/dashboard/usage' },
  { category: 'Navigation', icon: Settings, label: 'Go to Settings', path: '/dashboard/settings' },
  { category: 'Actions', icon: Plus, label: 'Create automation', path: '/dashboard/automations', action: 'create' },
  { category: 'Actions', icon: Key, label: 'Generate API key', path: '/dashboard/api-keys', action: 'create' },
  { category: 'Actions', icon: Users, label: 'Invite team member', path: '/dashboard/settings', action: 'team' },
];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef();
  const { theme } = useTheme();
  const light = theme === 'light';

  const autoItems = automations.map(a => ({
    category: 'Automations', icon: Zap, label: a.name, path: '/dashboard/automations',
  }));

  const allItems = [...navItems, ...autoItems];
  const filtered = query
    ? allItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  const grouped = {};
  filtered.forEach(i => { (grouped[i.category] ||= []).push(i); });

  useEffect(() => {
    if (open) { setQuery(''); setActiveIndex(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  const select = (item) => {
    navigate(item.path);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[activeIndex]) select(filtered[activeIndex]);
    if (e.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '20vh' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              width: 520, maxHeight: 420, background: light ? '#FFFFFF' : '#141420',
              border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, borderRadius: 12, overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}` }}>
              <Search size={16} style={{ color: '#7070A0', flexShrink: 0 }} />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Search pages, automations, actions..."
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: light ? '#0A0A0F' : '#F0F0F5', fontFamily: "'Inter', sans-serif" }} />
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <div style={{ padding: '8px 16px 4px', fontSize: 11, fontWeight: 500, color: light ? '#9090A8' : '#3A3A5A', textTransform: 'uppercase', letterSpacing: 1 }}>{cat}</div>
                  {items.map((item) => {
                    const idx = filtered.indexOf(item);
                    const Icon = item.icon;
                    return (
                      <button key={`${item.label}-${idx}`} onClick={() => select(item)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 16px',
                          background: idx === activeIndex ? (light ? '#F4F4F8' : 'rgba(0,229,204,0.06)') : 'transparent',
                          border: 'none', borderLeft: idx === activeIndex ? '2px solid #00E5CC' : '2px solid transparent',
                          fontSize: 13, color: light ? '#0A0A0F' : '#F0F0F5', textAlign: 'left', cursor: 'pointer',
                        }}>
                        <Icon size={14} style={{ color: '#7070A0' }} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              ))}
              {filtered.length === 0 && (
                <p style={{ padding: 20, textAlign: 'center', fontSize: 13, color: '#3A3A5A', fontFamily: 'var(--font-mono)' }}>{'>'} No results</p>
              )}
            </div>
            <div style={{ padding: '8px 16px', borderTop: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
              {[
                { keys: '↑↓', label: 'navigate' },
                { keys: 'Enter', label: 'select' },
                { keys: 'Esc', label: 'close' },
              ].map(h => (
                <span key={h.keys} style={{ fontSize: 11, color: '#3A3A5A' }}>
                  <kbd style={{ fontFamily: 'var(--font-mono)', padding: '1px 4px', border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, borderRadius: 3, fontSize: 10, marginRight: 4 }}>{h.keys}</kbd>
                  {h.label}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
