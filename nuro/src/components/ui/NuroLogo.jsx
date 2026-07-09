export function NuroMark({ size = 48, animate = false, className = '' }) {
  const scale = size / 160;
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}
      style={animate ? { animation: 'nuroSpin 200s linear infinite' } : undefined}>
      <circle cx="80" cy="80" r="72" stroke="#00E5CC" strokeWidth="1.5" opacity="0.9"
        strokeDasharray="420 999" strokeDashoffset="0" fill="none" />
      <circle cx="80" cy="80" r="72" stroke="#0A0A0F" strokeWidth="8"
        strokeDasharray="30 999" strokeDashoffset="-186" fill="none" style={animate ? { animation: 'nuroBreath 4s ease-in-out infinite' } : undefined} />
      <circle cx="106" cy="60" r="52" stroke="#00E5CC" strokeWidth="1.5" opacity="0.35" fill="none" />
      <circle cx="80" cy="80" r="7" fill="#00E5CC" />
      <circle cx="80" cy="80" r="3" fill="#0A0A0F" />
      <line x1="80" y1="87" x2="80" y2="152" stroke="#00E5CC" strokeWidth="1.2" opacity="0.5" />
      <style>{`
        @keyframes nuroSpin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes nuroBreath { 0%, 100% { opacity: 0.4 } 50% { opacity: 1 } }
      `}</style>
    </svg>
  );
}

export function NuroWordmark({ size = 24 }) {
  return (
    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: size, letterSpacing: -3, color: '#F0F0F5' }}>
      nuro
    </span>
  );
}

export function NuroLogoFull({ markSize = 32, wordSize = 22 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <NuroMark size={markSize} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <NuroWordmark size={wordSize} />
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 8, letterSpacing: 3, color: '#9090A8', textTransform: 'uppercase', marginTop: -2 }}>
          Automate Your Business
        </span>
      </div>
    </div>
  );
}
