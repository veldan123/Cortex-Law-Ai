import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, MoreHorizontal, Upload, Download, Play, Edit2, Copy, Trash2, BarChart2, X } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { automations as initialAutomations, generateUsageData } from '../../data/mockData';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Toggle from '../../components/ui/Toggle';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Tooltip from '../../components/ui/Tooltip';
import EmptyState from '../../components/ui/EmptyState';
import CodeBlock from '../../components/ui/CodeBlock';

function parseCron(expr) {
  const parts = expr.split(' ');
  if (parts.length !== 5) return expr;
  const [min, hour, dom, mon, dow] = parts;
  if (min === '0' && hour !== '*' && dom === '*' && mon === '*') {
    if (dow === '*') return `Runs every day at ${hour}:00`;
    if (dow === '1,4') return `Runs Monday and Thursday at ${hour}:00`;
    if (dow === '1-5') return `Runs weekdays at ${hour}:00`;
  }
  return `Cron: ${expr}`;
}

export default function Automations() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const light = theme === 'light';
  const text = light ? '#0A0A0F' : '#F0F0F5';
  const secondary = light ? '#505070' : '#7070A0';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const border = light ? '#E0E0EC' : '#1E1E2E';
  const bgAlt = light ? '#F4F4F8' : '#0F0F17';

  const [autos, setAutos] = useState(initialAutomations);
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [simId, setSimId] = useState(null);
  const [simLines, setSimLines] = useState([]);
  const [simDone, setSimDone] = useState(false);
  const [statsId, setStatsId] = useState(null);
  const [importPreview, setImportPreview] = useState(null);

  const [form, setForm] = useState({ name: '', trigger: 'webhook', cron: '0 9 * * *', action: 'email' });

  const resetForm = () => setForm({ name: '', trigger: 'webhook', cron: '0 9 * * *', action: 'email' });

  const openCreate = (prefill) => {
    resetForm();
    if (prefill) setForm({ ...form, ...prefill });
    setEditId(null);
    setCreateOpen(true);
  };

  const openEdit = (auto) => {
    setForm({ name: auto.name, trigger: auto.trigger, cron: auto.triggerConfig?.cron || '0 9 * * *', action: auto.action });
    setEditId(auto.id);
    setCreateOpen(true);
  };

  const saveAutomation = () => {
    if (!form.name.trim()) return;
    if (editId) {
      setAutos(autos.map(a => a.id === editId ? { ...a, name: form.name, trigger: form.trigger, action: form.action, triggerConfig: form.trigger === 'schedule' ? { cron: form.cron } : a.triggerConfig } : a));
      addToast('Automation updated', 'success');
    } else {
      const newAuto = {
        id: `auto_${Date.now()}`, name: form.name, trigger: form.trigger,
        triggerConfig: form.trigger === 'webhook' ? { url: `https://hooks.nuro.ai/wh_${Math.random().toString(36).slice(2, 10)}` } : form.trigger === 'schedule' ? { cron: form.cron } : {},
        action: form.action, actionConfig: {}, status: 'active', lastRun: null, runCount: 0, successRate: 0, avgDuration: 0, category: 'Custom',
      };
      setAutos([newAuto, ...autos]);
      addToast('Automation created', 'success');
    }
    setCreateOpen(false);
  };

  const deleteAutomation = (id) => {
    setAutos(autos.filter(a => a.id !== id));
    addToast('Automation deleted', 'success');
    setCreateOpen(false);
  };

  const duplicateAutomation = (auto) => {
    const dup = { ...auto, id: `auto_${Date.now()}`, name: `${auto.name} (copy)`, runCount: 0, lastRun: null };
    setAutos([dup, ...autos]);
    addToast('Automation duplicated', 'success');
  };

  const toggleStatus = (id) => {
    setAutos(autos.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a));
    const auto = autos.find(a => a.id === id);
    addToast(`${auto.name} ${auto.status === 'active' ? 'paused' : 'enabled'}`, 'info');
  };

  const runSimulation = (auto) => {
    setSimId(auto.id);
    setSimLines([]);
    setSimDone(false);
    setMenuId(null);
    const now = new Date();
    const fmt = (s) => now.toTimeString().slice(0, 8);
    const lines = [
      `[${fmt()}] Trigger received`,
      `[${fmt()}] Validating payload...`,
      `[${fmt()}] Payload valid`,
      `[${fmt()}] Executing action: ${auto.action === 'email' ? 'Send email' : auto.action === 'slack' ? 'Post to Slack' : auto.action === 'ai_response' ? 'Generate AI response' : 'HTTP request'}`,
      `[${fmt()}] Connecting to ${auto.action === 'email' ? 'SMTP' : auto.action === 'slack' ? 'Slack API' : 'endpoint'}...`,
      `[${fmt()}] ${auto.action === 'email' ? 'Email sent to customer@example.com' : auto.action === 'slack' ? 'Message posted to #revenue' : 'Response received (200 OK)'}`,
      `[${fmt()}] Automation complete. Duration: ${(Math.random() * 2 + 0.5).toFixed(2)}s`,
    ];
    lines.forEach((line, i) => {
      setTimeout(() => {
        setSimLines(prev => [...prev, line]);
        if (i === lines.length - 1) setSimDone(true);
      }, i * 400);
    });
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(autos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `nuro-automations-${new Date().toISOString().split('T')[0]}.json`; a.click();
    URL.revokeObjectURL(url);
    addToast('Automations exported', 'success');
  };

  const exportOne = (auto) => {
    const blob = new Blob([JSON.stringify(auto, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `nuro-${auto.name.replace(/\s/g, '-')}.json`; a.click();
    URL.revokeObjectURL(url);
    addToast('Automation exported', 'success');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const items = Array.isArray(data) ? data : [data];
        const dupes = items.filter(i => autos.some(a => a.name === i.name)).length;
        setImportPreview({ items, dupes });
      } catch { addToast('Invalid JSON file', 'error'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmImport = () => {
    const items = importPreview.items.map(i => ({ ...i, id: `auto_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` }));
    setAutos([...items, ...autos]);
    setImportPreview(null);
    addToast(`${items.length} automation(s) imported`, 'success');
  };

  const statsAuto = autos.find(a => a.id === statsId);
  const statsData = useMemo(() => generateUsageData(14).map(d => ({ ...d, runs: Math.floor(Math.random() * 30 + 5) })), [statsId]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="secondary" onClick={exportAll} style={{ padding: '6px 12px' }}><Download size={14} /> Export all</Button>
          <label style={{ display: 'inline-flex' }}>
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            <Button variant="secondary" onClick={(e) => e.currentTarget.previousSibling.click()} style={{ padding: '6px 12px' }}><Upload size={14} /> Import</Button>
          </label>
          <Button onClick={() => openCreate()} style={{ padding: '6px 14px' }}><Plus size={14} /> New automation</Button>
        </div>
      </div>

      {autos.length === 0 ? (
        <EmptyState message="No automations found. Run 'nuro create' to get started." action="Create automation" onAction={() => openCreate()} />
      ) : (
        <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {['Name', 'Trigger', 'Last run', 'Runs', 'Status', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: muted, fontWeight: 500, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {autos.map(auto => (
                <tr key={auto.id} style={{ borderBottom: `1px solid ${border}` }}>
                  <td style={{ padding: '12px 14px', color: text, fontWeight: 500 }}>{auto.name}</td>
                  <td style={{ padding: '12px 14px' }}><Badge type={auto.trigger}>{auto.trigger}</Badge></td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: muted }}>
                    {auto.lastRun ? new Date(auto.lastRun).toLocaleString() : '—'}
                  </td>
                  <td style={{ padding: '12px 14px', color: secondary }}>{auto.runCount.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <Toggle checked={auto.status === 'active'} onChange={() => toggleStatus(auto.id)} />
                  </td>
                  <td style={{ padding: '12px 14px', position: 'relative' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => setStatsId(auto.id)} aria-label="Stats" style={{ background: 'none', border: 'none', color: secondary, padding: 4, cursor: 'pointer' }}><BarChart2 size={14} /></button>
                      <button onClick={() => setMenuId(menuId === auto.id ? null : auto.id)} aria-label="Actions" style={{ background: 'none', border: 'none', color: secondary, padding: 4, cursor: 'pointer' }}><MoreHorizontal size={14} /></button>
                    </div>
                    {menuId === auto.id && (
                      <div style={{ position: 'absolute', right: 14, top: '100%', zIndex: 20, background: light ? '#FFFFFF' : '#141420', border: `1px solid ${border}`, borderRadius: 8, padding: 4, width: 160 }}
                        onMouseLeave={() => setMenuId(null)}>
                        {[
                          { icon: Play, label: auto.status === 'paused' ? 'Enable to run' : 'Run now', action: () => { if (auto.status === 'paused') { toggleStatus(auto.id); } runSimulation(auto); } },
                          { icon: Edit2, label: 'Edit', action: () => { openEdit(auto); setMenuId(null); } },
                          { icon: Copy, label: 'Duplicate', action: () => { duplicateAutomation(auto); setMenuId(null); } },
                          { icon: Download, label: 'Export', action: () => { exportOne(auto); setMenuId(null); } },
                          { icon: Trash2, label: 'Delete', action: () => { deleteAutomation(auto.id); setMenuId(null); }, danger: true },
                        ].map(item => (
                          <button key={item.label} onClick={item.action} style={{
                            display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '6px 10px',
                            background: 'none', border: 'none', fontSize: 12, borderRadius: 4, cursor: 'pointer',
                            color: item.danger ? '#FF4466' : text, textAlign: 'left',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = light ? '#F4F4F8' : '#0F0F17'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                            <item.icon size={13} />{item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={editId ? 'Edit automation' : 'New automation'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Order follow-up" />

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: muted, marginBottom: 6, display: 'block' }}>
              Trigger <Tooltip text="What starts this automation" />
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['webhook', 'schedule', 'manual'].map(t => (
                <button key={t} onClick={() => setForm({ ...form, trigger: t })} style={{
                  padding: '8px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                  background: form.trigger === t ? 'rgba(0,229,204,0.08)' : 'transparent',
                  border: `1px solid ${form.trigger === t ? '#00E5CC' : border}`,
                  color: form.trigger === t ? '#00E5CC' : secondary, textTransform: 'capitalize',
                }}>{t}</button>
              ))}
            </div>
            {form.trigger === 'webhook' && (
              <div style={{ marginTop: 12, padding: 10, background: bgAlt, borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 12, color: '#00E5CC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>https://hooks.nuro.ai/wh_{Math.random().toString(36).slice(2, 10)}</span>
                <button onClick={() => { navigator.clipboard.writeText('https://hooks.nuro.ai/wh_demo'); addToast('URL copied', 'success'); }}
                  style={{ background: 'none', border: 'none', color: '#00E5CC', fontSize: 11, cursor: 'pointer' }}>Copy</button>
              </div>
            )}
            {form.trigger === 'schedule' && (
              <div style={{ marginTop: 12 }}>
                <Input label="Cron expression" value={form.cron} onChange={(e) => setForm({ ...form, cron: e.target.value })} style={{ fontFamily: 'var(--font-mono)' }} />
                <span style={{ fontSize: 12, color: '#00E5CC', marginTop: 4, display: 'block' }}>{parseCron(form.cron)}</span>
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: muted, marginBottom: 6, display: 'block' }}>Action</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[{ v: 'http', l: 'HTTP Request' }, { v: 'email', l: 'Send Email' }, { v: 'slack', l: 'Slack Message' }, { v: 'ai_response', l: 'AI Response' }].map(a => (
                <button key={a.v} onClick={() => setForm({ ...form, action: a.v })} style={{
                  padding: '8px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                  background: form.action === a.v ? 'rgba(0,229,204,0.08)' : 'transparent',
                  border: `1px solid ${form.action === a.v ? '#00E5CC' : border}`,
                  color: form.action === a.v ? '#00E5CC' : secondary,
                }}>{a.l}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {editId && <Button variant="danger" onClick={() => deleteAutomation(editId)} style={{ flex: 1, justifyContent: 'center' }}>Delete</Button>}
            <Button onClick={saveAutomation} style={{ flex: 2, justifyContent: 'center' }}>{editId ? 'Save' : 'Create automation'}</Button>
          </div>
        </div>
      </Modal>

      {/* Simulation panel */}
      <AnimatePresence>
        {simId && (
          <motion.div initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 320, zIndex: 60, background: light ? '#FFFFFF' : '#0A0A0F', borderLeft: `1px solid ${border}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: text }}>Run simulation</h3>
              <button onClick={() => setSimId(null)} aria-label="Close" style={{ background: 'none', border: 'none', color: secondary }}><X size={16} /></button>
            </div>
            <div style={{ flex: 1, padding: 16, fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.8, overflowY: 'auto' }}>
              {simLines.map((line, i) => <div key={i} style={{ color: line.includes('complete') ? '#00E5CC' : text }}>{line}</div>)}
              {!simDone && <span style={{ color: '#00E5CC', animation: 'blink 1s infinite' }}>_</span>}
            </div>
            {simDone && (
              <div style={{ padding: '12px 20px', borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge type="success">Success</Badge>
                <button onClick={() => setSimId(null)} style={{ background: 'none', border: 'none', color: '#00E5CC', fontSize: 12, cursor: 'pointer' }}>View in logs</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats panel */}
      <AnimatePresence>
        {statsId && statsAuto && (
          <motion.div initial={{ x: 360 }} animate={{ x: 0 }} exit={{ x: 360 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 360, zIndex: 60, background: light ? '#FFFFFF' : '#0A0A0F', borderLeft: `1px solid ${border}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: text }}>{statsAuto.name}</h3>
              <button onClick={() => setStatsId(null)} aria-label="Close" style={{ background: 'none', border: 'none', color: secondary }}><X size={16} /></button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { l: 'Total runs', v: statsAuto.runCount.toLocaleString() },
                  { l: 'Success rate', v: `${statsAuto.successRate}%` },
                  { l: 'Avg duration', v: `${statsAuto.avgDuration}s` },
                  { l: 'Category', v: statsAuto.category },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: text }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: muted }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, color: muted, marginBottom: 8 }}>Runs (14 days)</div>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={statsData}>
                    <Line type="monotone" dataKey="runs" stroke="#00E5CC" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div style={{ fontSize: 12, color: muted, marginBottom: 8 }}>Last 5 runs</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: Math.random() > 0.15 ? '#00E5CC' : '#FF4466' }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import preview modal */}
      <Modal open={!!importPreview} onClose={() => setImportPreview(null)} title="Import automations">
        {importPreview && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: text }}>{importPreview.items.length} automation(s) found in file.</p>
            {importPreview.dupes > 0 && (
              <p style={{ fontSize: 13, color: '#FFB020', padding: '8px 12px', background: 'rgba(255,176,32,0.06)', borderRadius: 6 }}>
                {importPreview.dupes} automation(s) already exist with these names. Import anyway?
              </p>
            )}
            {importPreview.items.map((item, i) => (
              <div key={i} style={{ padding: '8px 12px', background: bgAlt, borderRadius: 6, fontSize: 13, color: text }}>{item.name}</div>
            ))}
            <Button onClick={confirmImport} style={{ justifyContent: 'center' }}>Confirm import</Button>
          </div>
        )}
      </Modal>

      <style>{`@keyframes blink { 0%, 50% { opacity: 1 } 51%, 100% { opacity: 0 } }`}</style>
    </div>
  );
}
