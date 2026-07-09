import { useTheme } from '../../context/ThemeContext';

export default function EmptyState({ message = 'No items found.', action, onAction }) {
  const { theme } = useTheme();
  const light = theme === 'light';
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: light ? '#9090A8' : '#3A3A5A' }}>
        {'> '}{message}
      </p>
      {action && (
        <button onClick={onAction} style={{ background: 'none', border: 'none', color: '#00E5CC', fontSize: 13, marginTop: 12, cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
          {action}
        </button>
      )}
    </div>
  );
}
