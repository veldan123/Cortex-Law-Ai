import { useMemo } from 'react';
import { Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { ApiCallsChart, AutomationsByTypeChart, SuccessRateChart, UsageGauge } from '../../components/charts/UsageChart';
import { automations } from '../../data/mockData';
import Button from '../../components/ui/Button';

export default function Usage() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const light = theme === 'light';
  const text = light ? '#0A0A0F' : '#F0F0F5';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const secondary = light ? '#505070' : '#7070A0';
  const border = light ? '#E0E0EC' : '#1E1E2E';

  const exportCSV = () => {
    const header = 'Automation,Runs,Success Rate,Avg Duration\n';
    const rows = automations.map(a => `${a.name},${a.runCount},${a.successRate}%,${a.avgDuration}s`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'nuro-usage.csv'; a.click();
    URL.revokeObjectURL(url);
    addToast('Usage data exported', 'success');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <Button variant="secondary" onClick={exportCSV} style={{ padding: '6px 12px' }}><Download size={14} /> Export CSV</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }} className="usage-grid">
        <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}><ApiCallsChart /></div>
        <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}><AutomationsByTypeChart /></div>
        <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, padding: 20 }}><SuccessRateChart /></div>
        <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, padding: 20, display: 'flex', justifyContent: 'center' }}>
          <UsageGauge used={4012} total={10000} label="Plan usage" />
        </div>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 500, color: text, marginBottom: 12 }}>Usage by automation</h3>
      <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {['Automation', 'Runs', 'Success rate', 'Avg duration'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: muted, fontWeight: 500, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {automations.map(a => (
              <tr key={a.id} style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ padding: '10px 14px', color: text }}>{a.name}</td>
                <td style={{ padding: '10px 14px', color: secondary }}>{a.runCount.toLocaleString()}</td>
                <td style={{ padding: '10px 14px', color: a.successRate >= 98 ? '#00E5CC' : a.successRate >= 95 ? '#FFB020' : '#FF4466' }}>{a.successRate}%</td>
                <td style={{ padding: '10px 14px', color: secondary }}>{a.avgDuration}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`@media (max-width: 768px) { .usage-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
