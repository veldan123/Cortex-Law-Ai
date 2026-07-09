import { useTheme } from '../../context/ThemeContext';

export default function Input({ label, error, ...props }) {
  const { theme } = useTheme();
  const light = theme === 'light';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: light ? '#505070' : '#7070A0', letterSpacing: 0.5 }}>{label}</label>}
      <input
        {...props}
        style={{
          background: light ? '#F4F4F8' : '#0F0F17',
          border: `1px solid ${error ? '#FF4466' : light ? '#E0E0EC' : '#1E1E2E'}`,
          borderRadius: 6,
          padding: '10px 14px',
          fontSize: 14,
          color: light ? '#0A0A0F' : '#F0F0F5',
          outline: 'none',
          transition: 'border-color 200ms',
          fontFamily: "'Inter', sans-serif",
          width: '100%',
          ...(props.style || {}),
        }}
        onFocus={(e) => { e.target.style.borderColor = '#00E5CC'; props.onFocus?.(e); }}
        onBlur={(e) => { e.target.style.borderColor = error ? '#FF4466' : light ? '#E0E0EC' : '#1E1E2E'; props.onBlur?.(e); }}
      />
      {error && <span style={{ fontSize: 12, color: '#FF4466' }}>{error}</span>}
    </div>
  );
}
