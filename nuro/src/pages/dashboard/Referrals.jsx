import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { referrals } from '../../data/mockData';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Referrals() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const light = theme === 'light';
  const text = light ? '#0A0A0F' : '#F0F0F5';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const secondary = light ? '#505070' : '#7070A0';
  const border = light ? '#E0E0EC' : '#1E1E2E';

  const [copied, setCopied] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');

  const link = 'nuro.ai/r/veldan';
  const totalReferred = referrals.length;
  const converted = referrals.filter(r => r.status === 'converted').length;
  const credits = referrals.reduce((s, r) => s + r.credit, 0);

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${link}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Credits balance */}
      <div style={{ padding: 24, background: 'rgba(0,229,204,0.04)', border: '1px solid rgba(0,229,204,0.12)', borderRadius: 8, marginBottom: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#00E5CC' }}>${credits} in credits</div>
        <p style={{ fontSize: 13, color: secondary, marginTop: 4 }}>Applied automatically at next billing</p>
      </div>

      {/* Referral link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: 16, background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8 }}>
        <span style={{ fontSize: 13, color: muted }}>Your link:</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: text, flex: 1 }}>{link}</span>
        <button onClick={copyLink} style={{ background: 'none', border: 'none', color: copied ? '#00E5CC' : secondary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
        </button>
        <Button variant="secondary" onClick={() => setEmailOpen(true)} style={{ padding: '6px 12px', fontSize: 12 }}>Share via email</Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
        {[
          { label: 'Total referred', value: totalReferred },
          { label: 'Converted to paid', value: converted },
          { label: 'Credits earned', value: `$${credits}` },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, padding: '0 20px', borderRight: i < 2 ? `1px solid ${border}` : 'none' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: text }}>{s.value}</div>
            <div style={{ fontSize: 12, color: muted }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ padding: 16, background: light ? '#F4F4F8' : '#0F0F17', borderRadius: 8, marginBottom: 24 }}>
        <p style={{ fontSize: 14, color: text, fontWeight: 500, marginBottom: 4 }}>How it works</p>
        <p style={{ fontSize: 13, color: secondary }}>Refer a business → they get 1 month free → you get $20 credit</p>
      </div>

      {/* History */}
      <h3 style={{ fontSize: 14, fontWeight: 500, color: text, marginBottom: 12 }}>Referral history</h3>
      <div style={{ background: light ? '#FFFFFF' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {['Email', 'Date', 'Status', 'Credit'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: muted, fontWeight: 500, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {referrals.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ padding: '10px 14px', color: text }}>{r.email}</td>
                <td style={{ padding: '10px 14px', color: muted }}>{r.date}</td>
                <td style={{ padding: '10px 14px' }}><Badge type={r.status}>{r.status.replace('_', ' ')}</Badge></td>
                <td style={{ padding: '10px 14px', color: r.credit > 0 ? '#00E5CC' : muted }}>{r.credit > 0 ? `$${r.credit}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={emailOpen} onClose={() => setEmailOpen(false)} title="Share via email" width={440}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Recipient email" type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="colleague@company.com" />
          <div style={{ padding: 12, background: light ? '#F4F4F8' : '#0F0F17', borderRadius: 6, fontSize: 13, color: secondary, lineHeight: 1.6 }}>
            Subject: Try Nuro — get 1 month free<br /><br />
            Hey,<br /><br />
            I've been using Nuro to automate repetitive tasks and it's saved me hours every week. If you sign up with my link, you get your first month free: https://{link}<br /><br />
            Worth checking out if your team handles a lot of manual work.
          </div>
          <Button onClick={() => { addToast(`Referral email sent to ${emailTo}`, 'success'); setEmailOpen(false); setEmailTo(''); }} style={{ justifyContent: 'center' }}>
            Send email
          </Button>
        </div>
      </Modal>
    </div>
  );
}
