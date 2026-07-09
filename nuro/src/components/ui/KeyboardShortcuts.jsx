import Modal from './Modal';
import { useTheme } from '../../context/ThemeContext';

const shortcuts = [
  { category: 'Navigation', items: [
    { keys: ['G', 'O'], label: 'Go to Overview' },
    { keys: ['G', 'A'], label: 'Go to Automations' },
    { keys: ['G', 'L'], label: 'Go to Logs' },
    { keys: ['G', 'S'], label: 'Go to Settings' },
  ]},
  { category: 'Actions', items: [
    { keys: ['C'], label: 'Create new automation' },
    { keys: ['⌘', 'K'], label: 'Open command palette' },
    { keys: ['Esc'], label: 'Close modal / cancel' },
  ]},
  { category: 'Automations', items: [
    { keys: ['R'], label: 'Run selected automation' },
    { keys: ['E'], label: 'Edit selected automation' },
    { keys: ['D'], label: 'Duplicate selected automation' },
  ]},
];

export default function KeyboardShortcuts({ open, onClose }) {
  const { theme } = useTheme();
  const light = theme === 'light';

  return (
    <Modal open={open} onClose={onClose} title="Keyboard shortcuts" width={520}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {shortcuts.map(s => (
          <div key={s.category}>
            <div style={{ fontSize: 11, fontWeight: 500, color: light ? '#9090A8' : '#3A3A5A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{s.category}</div>
            {s.items.map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                <span style={{ fontSize: 13, color: light ? '#0A0A0F' : '#F0F0F5' }}>{item.label}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {item.keys.map((k, i) => (
                    <span key={i}>
                      <kbd style={{
                        fontFamily: 'var(--font-mono)', fontSize: 11, padding: '2px 6px',
                        background: light ? '#F4F4F8' : '#0F0F17',
                        border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`,
                        borderRadius: 4, color: light ? '#0A0A0F' : '#F0F0F5',
                      }}>{k}</kbd>
                      {i < item.keys.length - 1 && <span style={{ color: '#3A3A5A', fontSize: 11, margin: '0 2px' }}>then</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
}
