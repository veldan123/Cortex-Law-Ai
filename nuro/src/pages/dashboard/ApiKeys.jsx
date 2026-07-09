import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Copy, Check, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { apiKeys as initialKeys } from '../../data/mockData';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

function maskKey(key) {
  return key.slice(0, 14) + '...' + key.slice(-4);
}

export default function ApiKeys() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const light = theme === 'light';
  const text = light ? '#0A0A0F' : '#F0F0F5';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const border = light ? '#E0E0EC' : '#1E1E2E';
  const secondary = light ? '#505070' : '#7070A0';

  const [keys, setKeys] = useState(initialKeys);
  const [revealId, setRevealId] = useState(null);
  const [revealCountdown, setRevealCountdown] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newKey, setNewKey] = useState(null);
  const [form, setForm] = useState({ name: '', environment: 'live', permissions: ['automations:read', 'automations:write'] });
  const [revokeId, setRevokeId] = useState(null);
  const intervalRef = useRef();

  useEffect(() => {
    if (revealId && revealCountdown > 0) {
      intervalRef.current = setInterval(() => {
        setRevealCountdown(c => {
          if (c <= 1) { setRevealId(null); clearInterval(intervalRef.current); return 0; }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [revealId, revealCountdown]);

  const reveal = (id) => {
    setRevealId(id);
    setRevealCountdown(10);
  };

  const copy = (key, id) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generate = () => {
    const key = `nuro_${form.environment === 'live' ? 'live' : 'test'}_${Array.from({ length: 32 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('')}`;
    const newEntry = {
      id: `key_${Date.now()}`, name: form.name || 'Unnamed', key, environment: form.environment,
      created: new Date().toISOString(), lastUsed: null, status: 'active', permissions: form.permissions,
    };
    setKeys([...keys, newEntry]);
    setNewKey(key);
    setCreateOpen(false);
  };

  const revoke = (id) => {
    setKeys(keys.filter(k => k.id !== id));
    addToast('API key revoked', 'success');
    setRevokeId(null);
  };

  const allPerms = ['automations:read', 'automations:write', 'logs:read', 'usage:read'];

  return (
    <div>
      <div style={{ padding: '12px 16px', background: 'rgba(255,176,32,0.06)', border: '1px solid rgba(255,176,32,0.15)', borderRadius: 8, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#FFB020' }}>
        <AlertTriangle size={16} /> Your API keys are secret. Never expose them in client-side code or public repositories.
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button onClick={() => { setForm({ name: '', environment: 'live', permissions: ['automations:read', 'automations:write'] }); setCreateOpen(true); }}>Generate new key</Button>
      </div>

      <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {['Name', 'Key', 'Env', 'Created', 'Last used', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: muted, fontWeight: 500, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.map(k => (
              <tr key={k.id} style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ padding: '12px 14px', color: text, fontWeight: 500 }}>{k.name}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: secondary }}>
                  {revealId === k.id ? (
                    <span>{k.key} <span style={{ fontSize: 10, color: '#FFB020' }}>({revealCountdown}s)</span></span>
                  ) : maskKey(k.key)}
                </td>
                <td style={{ padding: '12px 14px' }}><Badge type={k.environment}>{k.environment}</Badge></td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: muted }}>{new Date(k.created).toLocaleDateString()}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: muted }}>{k.lastUsed ? new Date(k.lastUsed).toLocaleDateString() : '—'}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => revealId === k.id ? setRevealId(null) : reveal(k.id)} aria-label="Reveal" style={{ background: 'none', border: 'none', color: secondary, padding: 4, cursor: 'pointer' }}>
                      {revealId === k.id ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => copy(k.key, k.id)} aria-label="Copy" style={{ background: 'none', border: 'none', color: copiedId === k.id ? '#00E5CC' : secondary, padding: 4, cursor: 'pointer' }}>
                      {copiedId === k.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button onClick={() => setRevokeId(k.id)} style={{ background: 'none', border: 'none', color: '#FF4466', fontSize: 11, cursor: 'pointer', padding: '4px 6px' }}>Revoke</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generate modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Generate new API key">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Production" />
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: muted, marginBottom: 6, display: 'block' }}>Environment</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['live', 'test'].map(e => (
                <button key={e} onClick={() => setForm({ ...form, environment: e })} style={{
                  padding: '8px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize',
                  background: form.environment === e ? 'rgba(0,229,204,0.08)' : 'transparent',
                  border: `1px solid ${form.environment === e ? '#00E5CC' : border}`,
                  color: form.environment === e ? '#00E5CC' : secondary,
                }}>{e}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: muted, marginBottom: 6, display: 'block' }}>Permissions</label>
            {allPerms.map(p => (
              <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 13, color: text, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.permissions.includes(p)} onChange={(e) => {
                  setForm({ ...form, permissions: e.target.checked ? [...form.permissions, p] : form.permissions.filter(x => x !== p) });
                }} style={{ accentColor: '#00E5CC' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{p}</span>
              </label>
            ))}
          </div>
          <Button onClick={generate} style={{ justifyContent: 'center' }}>Generate key</Button>
        </div>
      </Modal>

      {/* New key reveal */}
      <Modal open={!!newKey} onClose={() => setNewKey(null)} title="Your new API key">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: '10px 14px', background: 'rgba(255,176,32,0.06)', borderRadius: 6, fontSize: 13, color: '#FFB020' }}>
            Copy this now — you won't see it again.
          </div>
          <div style={{ padding: 12, background: light ? '#F4F4F8' : '#0F0F17', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 12, color: text, wordBreak: 'break-all', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span>{newKey}</span>
            <button onClick={() => { navigator.clipboard.writeText(newKey); addToast('Copied', 'success'); }} style={{ background: 'none', border: 'none', color: '#00E5CC', cursor: 'pointer', flexShrink: 0 }}><Copy size={14} /></button>
          </div>
          <Button variant="secondary" onClick={() => setNewKey(null)} style={{ justifyContent: 'center' }}>Done</Button>
        </div>
      </Modal>

      {/* Revoke confirmation */}
      <Modal open={!!revokeId} onClose={() => setRevokeId(null)} title="Revoke API key" width={400}>
        <p style={{ fontSize: 14, color: secondary, marginBottom: 16 }}>This action cannot be undone. Any applications using this key will stop working.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => setRevokeId(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
          <Button variant="danger" onClick={() => revoke(revokeId)} style={{ flex: 1, justifyContent: 'center' }}>Revoke key</Button>
        </div>
      </Modal>
    </div>
  );
}
