import { useState } from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { templates } from '../../data/mockData';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const categories = ['All', 'E-commerce', 'Customer Support', 'Marketing', 'Finance', 'Operations', 'HR'];
const catColors = { 'E-commerce': '#00E5CC', 'Customer Support': '#FFB020', Marketing: '#A070FF', Finance: '#FF4466', Operations: '#7070A0', HR: '#00A3FF' };

export default function Templates() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const light = theme === 'light';
  const text = light ? '#0A0A0F' : '#F0F0F5';
  const secondary = light ? '#505070' : '#7070A0';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const border = light ? '#E0E0EC' : '#1E1E2E';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [useTemplate, setUseTemplate] = useState(null);
  const [formName, setFormName] = useState('');

  const filtered = templates.filter(t => {
    if (category !== 'All' && t.category !== category) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleUse = (tpl) => {
    setUseTemplate(tpl);
    setFormName(tpl.name);
  };

  const handleCreate = () => {
    addToast(`Automation "${formName}" created from template`, 'success');
    setUseTemplate(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: muted }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..."
            style={{ width: '100%', padding: '8px 12px 8px 32px', background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 6, fontSize: 13, color: text, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: '5px 12px', borderRadius: 4, fontSize: 12,
              background: category === c ? 'rgba(0,229,204,0.08)' : 'transparent',
              border: `1px solid ${category === c ? '#00E5CC' : border}`,
              color: category === c ? '#00E5CC' : secondary, cursor: 'pointer',
            }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {filtered.map(tpl => (
          <div key={tpl.id} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px',
            background: light ? '#FFFFFF' : '#0F0F17', borderBottom: `1px solid ${border}`,
          }}>
            <span style={{ width: 3, height: 32, borderRadius: 2, background: catColors[tpl.category] || '#7070A0', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: text }}>{tpl.name}</div>
              <div style={{ fontSize: 12, color: secondary, marginTop: 2 }}>{tpl.description}</div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              <Badge type={tpl.trigger}>{tpl.trigger}</Badge>
              <Badge type={tpl.action}>{tpl.action}</Badge>
            </div>
            <Button variant="secondary" onClick={() => handleUse(tpl)} style={{ padding: '5px 12px', fontSize: 12, flexShrink: 0 }}>Use template</Button>
          </div>
        ))}
      </div>

      <Modal open={!!useTemplate} onClose={() => setUseTemplate(null)} title="Create from template">
        {useTemplate && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button onClick={() => setUseTemplate(null)} style={{ background: 'none', border: 'none', color: '#00E5CC', fontSize: 12, cursor: 'pointer', alignSelf: 'flex-start' }}>← Back to templates</button>
            <Input label="Automation name" value={formName} onChange={(e) => setFormName(e.target.value)} />
            <div style={{ padding: 12, background: light ? '#F4F4F8' : '#0F0F17', borderRadius: 6, fontSize: 13, color: secondary }}>
              <div>Trigger: <Badge type={useTemplate.trigger}>{useTemplate.trigger}</Badge></div>
              <div style={{ marginTop: 6 }}>Action: <Badge type={useTemplate.action}>{useTemplate.action}</Badge></div>
            </div>
            <p style={{ fontSize: 12, color: muted }}>{useTemplate.description}</p>
            <Button onClick={handleCreate} style={{ justifyContent: 'center' }}>Create automation</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
