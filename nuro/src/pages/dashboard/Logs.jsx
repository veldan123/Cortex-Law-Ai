import { useState, useMemo } from 'react';
import { Search, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { generateLogs, automations } from '../../data/mockData';
import Badge from '../../components/ui/Badge';
import CodeBlock from '../../components/ui/CodeBlock';
import Tooltip from '../../components/ui/Tooltip';
import Button from '../../components/ui/Button';

export default function Logs() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const light = theme === 'light';
  const text = light ? '#0A0A0F' : '#F0F0F5';
  const secondary = light ? '#505070' : '#7070A0';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const border = light ? '#E0E0EC' : '#1E1E2E';

  const allLogs = useMemo(() => generateLogs(), []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [autoFilter, setAutoFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = allLogs.filter(l => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (autoFilter !== 'all' && l.automationId !== autoFilter) return false;
    if (search && !l.automationName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const exportCSV = () => {
    const header = 'Timestamp,Automation,Trigger,Status,Duration,Error\n';
    const rows = filtered.map(l => `${l.timestamp},${l.automationName},${l.trigger},${l.status},${l.duration},${l.error || ''}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'nuro-logs.csv'; a.click();
    URL.revokeObjectURL(url);
    addToast('Logs exported', 'success');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: muted }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs..."
            style={{ width: '100%', padding: '8px 12px 8px 32px', background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 6, fontSize: 13, color: text, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['all', 'success', 'failed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '5px 12px', borderRadius: 4, fontSize: 12, textTransform: 'capitalize',
              background: statusFilter === s ? 'rgba(0,229,204,0.08)' : 'transparent',
              border: `1px solid ${statusFilter === s ? '#00E5CC' : border}`,
              color: statusFilter === s ? '#00E5CC' : secondary, cursor: 'pointer',
            }}>{s}</button>
          ))}
        </div>
        <select value={autoFilter} onChange={(e) => setAutoFilter(e.target.value)}
          style={{ padding: '6px 10px', background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 6, fontSize: 12, color: text, outline: 'none' }}>
          <option value="all">All automations</option>
          {automations.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <Button variant="secondary" onClick={exportCSV} style={{ padding: '6px 12px' }}><Download size={14} /> Export CSV</Button>
      </div>

      <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {['Timestamp', 'Automation', 'Trigger', 'Status', 'Duration', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: muted, fontWeight: 500, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <>
                <tr key={log.id} onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  style={{ borderBottom: `1px solid ${border}`, cursor: 'pointer', transition: 'background 200ms' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = light ? '#F4F4F8' : 'rgba(255,255,255,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '10px 14px', color: muted, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 14px', color: text }}>{log.automationName}</td>
                  <td style={{ padding: '10px 14px' }}><Badge type={log.trigger}>{log.trigger}</Badge></td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: log.status === 'success' ? '#00E5CC' : '#FF4466' }} />
                      <span style={{ color: log.status === 'success' ? '#00E5CC' : '#FF4466', fontSize: 12 }}>{log.status}</span>
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: secondary, fontSize: 12 }}>{log.duration}s</td>
                  <td style={{ padding: '10px 14px' }}>
                    {expandedId === log.id ? <ChevronUp size={14} style={{ color: muted }} /> : <ChevronDown size={14} style={{ color: muted }} />}
                  </td>
                </tr>
                {expandedId === log.id && (
                  <tr key={`${log.id}-detail`}>
                    <td colSpan={6} style={{ padding: '16px 20px', background: light ? '#F4F4F8' : '#0A0A0F' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                          <div style={{ fontSize: 11, color: muted, marginBottom: 6 }}>Request <Tooltip text="The data sent when a webhook fires — usually JSON format" /></div>
                          <CodeBlock code={JSON.stringify(log.request, null, 2)} language="json" />
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: muted, marginBottom: 6 }}>Response</div>
                          <CodeBlock code={JSON.stringify(log.response, null, 2)} language="json" />
                        </div>
                      </div>
                      {log.error && (
                        <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(255,68,102,0.06)', borderRadius: 6, fontSize: 13, color: '#FF4466' }}>
                          {log.error}
                        </div>
                      )}
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 11, color: muted, marginBottom: 8 }}>Execution timeline</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {log.steps.map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.status === 'success' ? '#00E5CC' : '#FF4466' }} />
                              <span style={{ fontSize: 12, color: text }}>{s.name}</span>
                              <span style={{ fontSize: 11, color: muted, marginLeft: 'auto' }}>{s.time}ms</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
