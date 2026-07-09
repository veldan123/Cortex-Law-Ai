import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/ui/Button';
import { NuroWordmark } from '../../components/ui/NuroLogo';

const sizes = ['Solo', '2-10', '11-50', '50+'];
const industries = ['SaaS', 'E-commerce', 'Agency', 'Healthcare', 'Finance', 'Education', 'Real Estate', 'Manufacturing', 'Consulting', 'Non-profit', 'Media', 'Other'];
const timeSinks = ['Customer emails', 'Follow-ups', 'Reporting', 'Social media', 'Data entry', 'Invoicing'];
const integrations = ['Gmail', 'Shopify', 'Slack', 'Notion', 'Airtable', 'Stripe', 'WhatsApp', 'Webhook'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const { theme } = useTheme();
  const light = theme === 'light';
  const [step, setStep] = useState(() => parseInt(sessionStorage.getItem('nuro-onboard-step') || '1'));
  const [data, setData] = useState(() => JSON.parse(sessionStorage.getItem('nuro-onboard-data') || '{}'));
  const [connected, setConnected] = useState([]);
  const [termLines, setTermLines] = useState([]);
  const termRef = useRef(false);

  const text = light ? '#0A0A0F' : '#F0F0F5';
  const secondary = light ? '#505070' : '#7070A0';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const border = light ? '#E0E0EC' : '#1E1E2E';
  const bgAlt = light ? '#F4F4F8' : '#0F0F17';

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    sessionStorage.setItem('nuro-onboard-step', step);
    sessionStorage.setItem('nuro-onboard-data', JSON.stringify(data));
  }, [step, data]);

  useEffect(() => {
    if (step === 4 && !termRef.current) {
      termRef.current = true;
      const lines = [
        '> Connecting to Nuro infrastructure...',
        '> Loading your workspace...',
        '> Automation engine ready.',
        `> Welcome to Nuro${user?.name ? ', ' + user.name : ''}.`,
      ];
      lines.forEach((line, i) => {
        setTimeout(() => setTermLines(prev => [...prev, line]), i * 800);
      });
    }
  }, [step, user]);

  const update = (key, val) => setData({ ...data, [key]: val });
  const toggleInSet = (key, val) => {
    const set = new Set(data[key] || []);
    set.has(val) ? set.delete(val) : set.add(val);
    update(key, [...set]);
  };

  const Tile = ({ label, selected, onClick }) => (
    <button onClick={onClick} style={{
      padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500,
      background: selected ? 'rgba(0,229,204,0.08)' : bgAlt,
      border: `1px solid ${selected ? '#00E5CC' : border}`,
      color: selected ? '#00E5CC' : text,
      cursor: 'pointer', transition: 'all 200ms', display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {selected && <Check size={14} />}{label}
    </button>
  );

  const suggestions = (data.timeSinks || []).includes('Customer emails')
    ? ['Auto-reply to new customer enquiries', 'Send welcome email to new signups', 'Follow up on unanswered tickets']
    : (data.timeSinks || []).includes('Invoicing')
    ? ['Send payment reminders for overdue invoices', 'Generate monthly invoices', 'Alert team on failed payments']
    : ['Send follow-up emails after purchases', 'Post revenue updates to Slack', 'Generate weekly reports'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, background: light ? '#FAFAFA' : '#0A0A0F' }}>
      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 500, marginTop: 40, marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <NuroWordmark size={20} />
          <span style={{ fontSize: 12, color: muted }}>{step} / 4</span>
        </div>
        <div style={{ height: 2, background: border, borderRadius: 1 }}>
          <div style={{ height: 2, background: '#00E5CC', borderRadius: 1, width: `${(step / 4) * 100}%`, transition: 'width 400ms ease' }} />
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 500 }}>
        {step === 1 && (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: text, marginBottom: 8 }}>Tell us about your business</h2>
            <p style={{ fontSize: 14, color: secondary, marginBottom: 24 }}>This helps us suggest the right automations for you.</p>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: muted, display: 'block', marginBottom: 8 }}>Team size</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {sizes.map(s => <Tile key={s} label={s} selected={data.size === s} onClick={() => update('size', s)} />)}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: muted, display: 'block', marginBottom: 8 }}>Industry</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {industries.map(i => <Tile key={i} label={i} selected={data.industry === i} onClick={() => update('industry', i)} />)}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: muted, display: 'block', marginBottom: 8 }}>What's your biggest time sink?</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {timeSinks.map(t => <Tile key={t} label={t} selected={(data.timeSinks || []).includes(t)} onClick={() => toggleInSet('timeSinks', t)} />)}
              </div>
            </div>

            <Button onClick={() => setStep(2)} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>Continue</Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: text, marginBottom: 8 }}>Connect your first tool</h2>
            <p style={{ fontSize: 14, color: secondary, marginBottom: 24 }}>Select the tools your business uses. We'll set up the connection.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {integrations.map(i => {
                const isConnected = connected.includes(i);
                return (
                  <button key={i} onClick={() => setConnected(isConnected ? connected.filter(c => c !== i) : [...connected, i])}
                    style={{
                      padding: '16px', borderRadius: 8, textAlign: 'center',
                      background: isConnected ? 'rgba(0,229,204,0.08)' : bgAlt,
                      border: `1px solid ${isConnected ? '#00E5CC' : border}`,
                      color: isConnected ? '#00E5CC' : text,
                      cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: 'all 200ms',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                    {isConnected && <Check size={14} />}{i}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="secondary" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>Back</Button>
              <Button onClick={() => setStep(3)} style={{ flex: 2, justifyContent: 'center' }}>Continue</Button>
            </div>
            <button onClick={() => setStep(3)} style={{ background: 'none', border: 'none', color: muted, fontSize: 12, marginTop: 12, cursor: 'pointer', width: '100%', textAlign: 'center' }}>
              Skip for now — you can connect tools later in Settings
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: text, marginBottom: 8 }}>Create your first automation</h2>
            <p style={{ fontSize: 14, color: secondary, marginBottom: 24 }}>Pick a suggestion or type your own.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => update('firstAutomation', s)}
                  style={{
                    padding: '14px 16px', borderRadius: 8, textAlign: 'left', fontSize: 14,
                    background: data.firstAutomation === s ? 'rgba(0,229,204,0.08)' : bgAlt,
                    border: `1px solid ${data.firstAutomation === s ? '#00E5CC' : border}`,
                    color: data.firstAutomation === s ? '#00E5CC' : text,
                    cursor: 'pointer', transition: 'all 200ms',
                  }}>{s}</button>
              ))}
            </div>

            <input value={data.firstAutomation || ''} onChange={(e) => update('firstAutomation', e.target.value)} placeholder="Or type your own..."
              style={{ width: '100%', padding: '10px 14px', background: bgAlt, border: `1px solid ${border}`, borderRadius: 6, fontSize: 14, color: text, outline: 'none', marginBottom: 16, fontFamily: "'Inter', sans-serif" }} />

            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="secondary" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>Back</Button>
              <Button onClick={() => setStep(4)} style={{ flex: 2, justifyContent: 'center' }}>Continue</Button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div style={{ background: bgAlt, border: `1px solid ${border}`, borderRadius: 8, padding: 20, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 2, marginBottom: 32, minHeight: 140 }}>
              {termLines.map((line, i) => (
                <div key={i} style={{ color: line.includes('Welcome') ? '#00E5CC' : text }}>{line}</div>
              ))}
              {termLines.length < 4 && <span style={{ color: '#00E5CC', animation: 'blink 1s infinite' }}>_</span>}
            </div>

            <Button onClick={() => { completeOnboarding(); navigate('/dashboard'); }} disabled={termLines.length < 4}
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              Enter dashboard
            </Button>
            <style>{`@keyframes blink { 0%, 50% { opacity: 1 } 51%, 100% { opacity: 0 } }`}</style>
          </>
        )}
      </div>
    </div>
  );
}
