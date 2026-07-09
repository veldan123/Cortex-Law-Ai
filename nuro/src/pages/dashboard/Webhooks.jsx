import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Tooltip from '../../components/ui/Tooltip';
import CodeBlock from '../../components/ui/CodeBlock';

const initialWebhooks = [
  { id: 'wh_1', url: 'https://myapp.com/nuro/webhook', events: ['automation.run.completed', 'automation.run.failed'], status: 'active', secret: 'whsec_a1b2c3d4e5' },
];

export default function Webhooks() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const light = theme === 'light';
  const text = light ? '#0A0A0F' : '#F0F0F5';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const secondary = light ? '#505070' : '#7070A0';
  const border = light ? '#E0E0EC' : '#1E1E2E';

  const [webhooks, setWebhooks] = useState(initialWebhooks);
  const [createOpen, setCreateOpen] = useState(false);
  const [url, setUrl] = useState('');

  const events = ['automation.run.started', 'automation.run.completed', 'automation.run.failed', 'automation.created', 'automation.deleted'];
  const [selectedEvents, setSelectedEvents] = useState([]);

  const create = () => {
    if (!url) return;
    setWebhooks([...webhooks, {
      id: `wh_${Date.now()}`, url, events: selectedEvents, status: 'active',
      secret: `whsec_${Math.random().toString(36).slice(2, 12)}`,
    }]);
    addToast('Webhook created', 'success');
    setCreateOpen(false);
    setUrl('');
    setSelectedEvents([]);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <Button onClick={() => setCreateOpen(true)}>Add webhook endpoint</Button>
      </div>

      {webhooks.map(wh => (
        <div key={wh.id} style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, padding: 20, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: text }}>{wh.url}</span>
            <Badge type={wh.status}>{wh.status}</Badge>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {wh.events.map(e => <Badge key={e} type="webhook">{e}</Badge>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: muted }}>
            Signing secret: <code style={{ fontFamily: 'var(--font-mono)', color: secondary }}>{wh.secret}</code>
            <Tooltip text="Used to verify webhook signatures with HMAC-SHA256" />
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button onClick={() => addToast('Test webhook sent', 'success')} style={{ background: 'none', border: 'none', color: '#00E5CC', fontSize: 12, cursor: 'pointer' }}>Send test</button>
            <button onClick={() => { setWebhooks(webhooks.filter(w => w.id !== wh.id)); addToast('Webhook deleted', 'success'); }} style={{ background: 'none', border: 'none', color: '#FF4466', fontSize: 12, cursor: 'pointer' }}>Delete</button>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: text, marginBottom: 8 }}>Retry logic <Tooltip text="If an automation fails, Nuro will try again up to 3 times before marking it as failed" /></h3>
        <p style={{ fontSize: 13, color: secondary }}>Failed deliveries are retried 3 times with exponential backoff: 1s, 10s, 60s.</p>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: text, marginBottom: 8 }}>Signature verification</h3>
        <CodeBlock language="javascript" code={`const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return signature === expected;
}`} />
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add webhook endpoint" width={480}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Endpoint URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-app.com/webhook" />
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: muted, marginBottom: 6, display: 'block' }}>Events</label>
            {events.map(e => (
              <label key={e} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 13, color: text, cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedEvents.includes(e)} onChange={(ev) => {
                  setSelectedEvents(ev.target.checked ? [...selectedEvents, e] : selectedEvents.filter(x => x !== e));
                }} style={{ accentColor: '#00E5CC' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{e}</span>
              </label>
            ))}
          </div>
          <Button onClick={create} style={{ justifyContent: 'center' }}>Create webhook</Button>
        </div>
      </Modal>
    </div>
  );
}
