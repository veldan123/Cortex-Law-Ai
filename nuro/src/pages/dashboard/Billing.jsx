import { useState } from 'react';
import { CreditCard, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { plans, invoices } from '../../data/mockData';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

export default function Billing() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const { user } = useAuth();
  const light = theme === 'light';
  const text = light ? '#0A0A0F' : '#F0F0F5';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const secondary = light ? '#505070' : '#7070A0';
  const border = light ? '#E0E0EC' : '#1E1E2E';
  const bgAlt = light ? '#F4F4F8' : '#0F0F17';

  const currentPlan = plans.find(p => p.name === (user?.plan || 'Growth'));
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelText, setCancelText] = useState('');

  const downloadInvoice = (inv) => {
    const text = `INVOICE ${inv.id}\nDate: ${inv.date}\nPlan: ${inv.plan}\nAmount: $${inv.amount}.00\nStatus: ${inv.status}\n\nNuro AI Automation Platform\nnuro.ai`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${inv.id}.txt`; a.click();
    URL.revokeObjectURL(url);
    addToast('Invoice downloaded', 'success');
  };

  return (
    <div>
      {/* Current plan */}
      <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: text }}>{currentPlan?.name} plan</h3>
              <Badge type="active">Active</Badge>
            </div>
            <p style={{ fontSize: 13, color: muted }}>Renews July 1, 2026</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: text }}>${currentPlan?.monthlyPrice}<span style={{ fontSize: 14, color: muted }}>/mo</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          {[
            { label: 'Automations', used: 4012, total: currentPlan?.automations },
            { label: 'API calls', used: 32400, total: currentPlan?.apiCalls },
            { label: 'Team members', used: 3, total: currentPlan?.teamMembers },
          ].map(u => (
            <div key={u.label} style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: muted, marginBottom: 4 }}>{u.label}</div>
              <div style={{ height: 4, background: border, borderRadius: 2 }}>
                <div style={{ height: 4, background: '#00E5CC', borderRadius: 2, width: `${u.total === -1 ? 10 : Math.min((u.used / u.total) * 100, 100)}%` }} />
              </div>
              <div style={{ fontSize: 11, color: secondary, marginTop: 2 }}>
                {u.total === -1 ? 'Unlimited' : `${u.used.toLocaleString()} / ${u.total.toLocaleString()}`}
              </div>
            </div>
          ))}
        </div>
        <Button onClick={() => setUpgradeOpen(true)} style={{ padding: '8px 16px' }}>Upgrade plan</Button>
      </div>

      {/* Payment method */}
      <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: text, marginBottom: 12 }}>Payment method</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ padding: '8px 14px', background: bgAlt, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={16} style={{ color: secondary }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: text }}>•••• •••• •••• 4242</span>
            <span style={{ fontSize: 11, color: muted }}>Visa</span>
          </div>
          <Button variant="secondary" onClick={() => setCardOpen(true)} style={{ padding: '6px 12px', fontSize: 12 }}>Update</Button>
        </div>
      </div>

      {/* Invoices */}
      <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${border}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: text }}>Invoice history</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {['Invoice', 'Date', 'Amount', 'Status', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: muted, fontWeight: 500, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: text, fontSize: 12 }}>{inv.id}</td>
                <td style={{ padding: '10px 14px', color: secondary }}>{inv.date}</td>
                <td style={{ padding: '10px 14px', color: text }}>${inv.amount}.00</td>
                <td style={{ padding: '10px 14px' }}><Badge type={inv.status}>{inv.status}</Badge></td>
                <td style={{ padding: '10px 14px' }}>
                  <button onClick={() => downloadInvoice(inv)} aria-label="Download" style={{ background: 'none', border: 'none', color: secondary, cursor: 'pointer', padding: 4 }}><Download size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={() => setCancelOpen(true)} style={{ background: 'none', border: 'none', color: '#FF4466', fontSize: 13, cursor: 'pointer' }}>Cancel plan</button>

      {/* Upgrade modal */}
      <Modal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} title="Change plan">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {plans.map(p => (
            <button key={p.name} onClick={() => { addToast(`Switched to ${p.name} plan`, 'success'); setUpgradeOpen(false); }}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px',
                background: p.name === currentPlan?.name ? 'rgba(0,229,204,0.06)' : 'transparent',
                border: `1px solid ${p.name === currentPlan?.name ? '#00E5CC' : border}`,
                borderRadius: 8, cursor: 'pointer', textAlign: 'left',
              }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: text }}>{p.name}</div>
                <div style={{ fontSize: 12, color: muted }}>{p.automations === -1 ? 'Unlimited' : p.automations.toLocaleString()} automations/mo</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: text }}>${p.monthlyPrice}<span style={{ fontSize: 12, color: muted }}>/mo</span></div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Card modal */}
      <Modal open={cardOpen} onClose={() => setCardOpen(false)} title="Update payment method" width={400}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Card number" placeholder="4242 4242 4242 4242" />
          <div style={{ display: 'flex', gap: 12 }}>
            <Input label="Expiry" placeholder="MM/YY" />
            <Input label="CVC" placeholder="123" />
          </div>
          <Button onClick={() => { addToast('Payment method updated', 'success'); setCardOpen(false); }} style={{ justifyContent: 'center', marginTop: 8 }}>Save card</Button>
        </div>
      </Modal>

      {/* Cancel modal */}
      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel plan" width={400}>
        <p style={{ fontSize: 14, color: secondary, marginBottom: 16 }}>Type CANCEL to confirm. Your automations will stop running immediately.</p>
        <Input value={cancelText} onChange={(e) => setCancelText(e.target.value)} placeholder="Type CANCEL" />
        <Button variant="danger" disabled={cancelText !== 'CANCEL'} onClick={() => { addToast('Plan cancelled', 'info'); setCancelOpen(false); setCancelText(''); }}
          style={{ justifyContent: 'center', marginTop: 12, width: '100%' }}>Confirm cancellation</Button>
      </Modal>
    </div>
  );
}
