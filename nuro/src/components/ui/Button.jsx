import { useTheme } from '../../context/ThemeContext';

const variants = {
  primary: (light) => ({
    background: '#00E5CC',
    color: '#0A0A0F',
    border: '1px solid #00E5CC',
  }),
  secondary: (light) => ({
    background: 'transparent',
    color: light ? '#0A0A0F' : '#F0F0F5',
    border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`,
  }),
  ghost: (light) => ({
    background: 'transparent',
    color: '#00E5CC',
    border: '1px solid transparent',
  }),
  danger: () => ({
    background: 'transparent',
    color: '#FF4466',
    border: '1px solid #FF4466',
  }),
};

export default function Button({ children, variant = 'primary', onClick, disabled, loading, style = {}, ...props }) {
  const { theme } = useTheme();
  const light = theme === 'light';
  const v = variants[variant]?.(light) || variants.primary(light);

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...v,
        padding: '8px 18px',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 200ms ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      {...props}
    >
      {loading && <span style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />}
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </button>
  );
}
