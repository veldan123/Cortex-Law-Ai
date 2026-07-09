export default function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: checked ? '#00E5CC' : '#1E1E2E',
        border: 'none',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 200ms',
        opacity: disabled ? 0.4 : 1,
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        top: 2,
        left: checked ? 18 : 2,
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: checked ? '#0A0A0F' : '#7070A0',
        transition: 'left 200ms',
      }} />
    </button>
  );
}
