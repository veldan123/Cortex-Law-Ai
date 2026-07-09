const colors = {
  webhook: { bg: 'rgba(0,229,204,0.1)', color: '#00E5CC' },
  schedule: { bg: 'rgba(112,112,160,0.15)', color: '#7070A0' },
  manual: { bg: 'rgba(255,176,32,0.1)', color: '#FFB020' },
  success: { bg: 'rgba(0,229,204,0.1)', color: '#00E5CC' },
  failed: { bg: 'rgba(255,68,102,0.1)', color: '#FF4466' },
  active: { bg: 'rgba(0,229,204,0.1)', color: '#00E5CC' },
  paused: { bg: 'rgba(112,112,160,0.15)', color: '#7070A0' },
  admin: { bg: 'rgba(0,229,204,0.1)', color: '#00E5CC' },
  editor: { bg: 'rgba(255,176,32,0.1)', color: '#FFB020' },
  viewer: { bg: 'rgba(112,112,160,0.15)', color: '#7070A0' },
  live: { bg: 'rgba(0,229,204,0.1)', color: '#00E5CC' },
  test: { bg: 'rgba(255,176,32,0.1)', color: '#FFB020' },
  paid: { bg: 'rgba(0,229,204,0.1)', color: '#00E5CC' },
  pending: { bg: 'rgba(255,176,32,0.1)', color: '#FFB020' },
  signed_up: { bg: 'rgba(112,112,160,0.15)', color: '#7070A0' },
  converted: { bg: 'rgba(0,229,204,0.1)', color: '#00E5CC' },
  email: { bg: 'rgba(0,229,204,0.08)', color: '#00E5CC' },
  slack: { bg: 'rgba(112,112,160,0.15)', color: '#7070A0' },
  http: { bg: 'rgba(255,176,32,0.1)', color: '#FFB020' },
  ai_response: { bg: 'rgba(160,112,255,0.1)', color: '#A070FF' },
};

export default function Badge({ children, type }) {
  const c = colors[type] || colors.manual;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 500,
      background: c.bg,
      color: c.color,
      letterSpacing: 0.3,
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    }}>
      {children || type}
    </span>
  );
}
