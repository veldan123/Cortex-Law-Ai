import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import ActivityChart from '../../components/charts/ActivityChart';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import CodeBlock from '../../components/ui/CodeBlock';
import { generateLogs } from '../../data/mockData';

function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(interval); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(interval);
  }, [value, duration]);
  return typeof value === 'number' && !String(value).includes('.') ? display.toLocaleString() : display.toFixed?.(1) || display;
}

export default function Overview() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const light = theme === 'light';
  const logs = useMemo(() => generateLogs(), []);
  const recentRuns = logs.slice(0, 10);
  const failedRuns = logs.filter(l => l.status === 'failed').slice(0, 5);
  const [detailLog, setDetailLog] = useState(null);

  const text = light ? '#0A0A0F' : '#F0F0F5';
  const secondary = light ? '#505070' : '#7070A0';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const border = light ? '#E0E0EC' : '#1E1E2E';

  const stats = [
    { label: 'Runs this month', value: 3247, change: '+12%' },
    { label: 'Success rate', value: '98.2%' },
    { label: 'Time saved', value: '47h' },
    { label: 'API calls left', value: 46753, bar: 0.65 },
  ];

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ flex: 1, padding: '0 20px', borderRight: i < stats.length - 1 ? `1px solid ${border}` : 'none' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: text, letterSpacing: '-0.02em' }}>
              {typeof s.value === 'number' ? <AnimatedNumber value={s.value} /> : s.value}
            </div>
            <div style={{ fontSize: 12, color: muted, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              {s.label}
              {s.change && <span style={{ color: '#00E5CC', fontSize: 11 }}>{s.change}</span>}
            </div>
            {s.bar !== undefined && (
              <div style={{ height: 2, background: border, borderRadius: 1, marginTop: 8 }}>
                <div style={{ height: 2, background: '#00E5CC', borderRadius: 1, width: `${s.bar * 100}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 24, marginBottom: 32 }} className="overview-grid">
        <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}>
          <ActivityChart />
        </div>
        <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: text, marginBottom: 16 }}>Recent runs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxHeight: 280, overflowY: 'auto' }}>
            {recentRuns.map(log => (
              <button key={log.id} onClick={() => setDetailLog(log)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0',
                borderBottom: `1px solid ${border}`, background: 'none', border: 'none', width: '100%',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: log.status === 'success' ? '#00E5CC' : '#FF4466' }} />
                  <span style={{ fontSize: 13, color: text }}>{log.automationName}</span>
                  <Badge type={log.trigger}>{log.trigger}</Badge>
                </div>
                <span style={{ fontSize: 11, color: muted, fontFamily: 'var(--font-mono)' }}>
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Failed runs */}
      {failedRuns.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: text, marginBottom: 12 }}>Failed runs</h3>
          <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${border}` }}>
                  {['Automation', 'Error', 'Time', ''].map(h => <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: muted, fontWeight: 500, fontSize: 11 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {failedRuns.map(log => (
                  <tr key={log.id} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: '10px 14px', color: text }}>{log.automationName}</td>
                    <td style={{ padding: '10px 14px', color: '#FF4466', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{log.error}</td>
                    <td style={{ padding: '10px 14px', color: muted, fontSize: 12 }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <button onClick={() => addToast('Retrying automation...', 'info')} style={{ background: 'none', border: 'none', color: '#00E5CC', fontSize: 12, cursor: 'pointer' }}>Retry</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log detail modal */}
      <Modal open={!!detailLog} onClose={() => setDetailLog(null)} title="Run details" width={560}>
        {detailLog && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Badge type={detailLog.status}>{detailLog.status}</Badge>
              <Badge type={detailLog.trigger}>{detailLog.trigger}</Badge>
              <span style={{ fontSize: 12, color: muted }}>{detailLog.duration}s</span>
            </div>
            <div>
              <div style={{ fontSize: 12, color: muted, marginBottom: 4 }}>Request</div>
              <CodeBlock code={JSON.stringify(detailLog.request, null, 2)} language="json" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: muted, marginBottom: 4 }}>Response</div>
              <CodeBlock code={JSON.stringify(detailLog.response, null, 2)} language="json" />
            </div>
            {detailLog.error && <div style={{ fontSize: 13, color: '#FF4466', padding: '8px 12px', background: 'rgba(255,68,102,0.06)', borderRadius: 6 }}>{detailLog.error}</div>}
            <div>
              <div style={{ fontSize: 12, color: muted, marginBottom: 8 }}>Execution timeline</div>
              {detailLog.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.status === 'success' ? '#00E5CC' : '#FF4466' }} />
                  <span style={{ fontSize: 12, color: text }}>{s.name}</span>
                  <span style={{ fontSize: 11, color: muted, marginLeft: 'auto' }}>{s.time}ms</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <style>{`@media (max-width: 768px) { .overview-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
