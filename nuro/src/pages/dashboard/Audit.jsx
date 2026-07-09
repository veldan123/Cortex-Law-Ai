import { useState } from 'react';
import { Download, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { auditEntries } from '../../data/mockData';
import Button from '../../components/ui/Button';

export default function Audit() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const light = theme === 'light';
  const text = light ? '#0A0A0F' : '#F0F0F5';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const secondary = light ? '#505070' : '#7070A0';
  const border = light ? '#E0E0EC' : '#1E1E2E';

  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');

  const users = [...new Set(auditEntries.map(e => e.user))];
  const filtered = auditEntries.filter(e => {
    if (userFilter !== 'all' && e.user !== userFilter) return false;
    if (search && !e.details.toLowerCase().includes(search.toLowerCase()) && !e.action.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const exportCSV = () => {
    const header = 'Timestamp,User,Action,Details,IP\n';
    const rows = filtered.map(e => `${e.timestamp},${e.user},${e.action},"${e.details}",${e.ip}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'nuro-audit-log.csv'; a.click();
    URL.revokeObjectURL(url);
    addToast('Audit log exported', 'success');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: muted }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search audit log..."
            style={{ width: '100%', padding: '8px 12px 8px 32px', background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 6, fontSize: 13, color: text, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
        </div>
        <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}
          style={{ padding: '6px 10px', background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 6, fontSize: 12, color: text, outline: 'none' }}>
          <option value="all">All users</option>
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <Button variant="secondary" onClick={exportCSV} style={{ padding: '6px 12px' }}><Download size={14} /> Export CSV</Button>
      </div>

      <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {['Timestamp', 'User', 'Action', 'Details', 'IP'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: muted, fontWeight: 500, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: muted }}>{new Date(e.timestamp).toLocaleString()}</td>
                <td style={{ padding: '10px 14px', color: secondary }}>{e.user}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: text }}>{e.action}</td>
                <td style={{ padding: '10px 14px', color: secondary }}>{e.details}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: muted }}>{e.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
