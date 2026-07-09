import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { NuroMark } from '../../components/ui/NuroLogo';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { plans } from '../../data/mockData';

const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }) };

function Section({ children, id, style = {} }) {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section ref={ref} id={id} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, ease: 'easeOut' }} style={{ padding: '120px 24px', ...style }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>{children}</div>
    </motion.section>
  );
}

function TerminalDemo() {
  const { theme } = useTheme();
  const light = theme === 'light';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [jsonConfig, setJsonConfig] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput('');
    setJsonConfig(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': '', 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: `You are Nuro, an AI automation platform assistant. When a user describes a business problem or task they want to automate, respond with: 1. A clear explanation of how Nuro would automate it (2-3 sentences) 2. The specific trigger that would start the automation 3. The specific actions Nuro would take 4. An estimated time saving per month. Be specific and practical. No vague marketing language. Keep responses under 150 words.`,
          messages: [{ role: 'user', content: input }],
        }),
      });

      if (!response.ok) throw new Error('API unavailable');
      const data = await response.json();
      const text = data.content?.[0]?.text || 'No response received.';
      typeOut(text);

      setJsonConfig({
        automation: { name: input.slice(0, 40), trigger: { type: 'webhook', event: 'custom' }, actions: [{ type: 'ai_response', model: 'claude-sonnet-4-6' }], schedule: null, status: 'active' },
      });
    } catch {
      typeOut(simulateResponse(input));
      setJsonConfig({
        automation: { name: input.slice(0, 40), trigger: { type: 'webhook', event: 'custom' }, actions: [{ type: 'email', template: 'auto_generated' }], status: 'active' },
      });
    }
  };

  function simulateResponse(q) {
    return `Nuro would handle this by creating a webhook-triggered automation that listens for the relevant event. When triggered, it executes your configured action sequence — whether that's sending emails, posting to Slack, or making HTTP requests to external services.\n\nTrigger: Webhook (fires on new event)\nActions: Parse payload → Execute business logic → Send notification\nEstimated time saved: 8-12 hours/month`;
  }

  function typeOut(text) {
    setLoading(false);
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      setOutput(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 15);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }} className="terminal-grid">
      <div style={{ background: light ? '#F4F4F8' : '#0F0F17', border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '8px 14px', borderBottom: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F57' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FEBC2E' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28C840' }} />
          <span style={{ fontSize: 11, color: light ? '#9090A8' : '#3A3A5A', marginLeft: 8, fontFamily: 'var(--font-mono)' }}>nuro terminal</span>
        </div>
        <div style={{ padding: 16 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: '#00E5CC', fontFamily: 'var(--font-mono)', fontSize: 13 }}>$</span>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe what you want to automate..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 13, color: light ? '#0A0A0F' : '#F0F0F5' }} />
          </form>
          {loading && <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 13, color: '#00E5CC' }}>thinking<span style={{ animation: 'blink 1s infinite' }}>_</span></div>}
          {output && <pre style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 12, color: light ? '#0A0A0F' : '#F0F0F5', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{output}</pre>}
        </div>
      </div>

      <div style={{ background: light ? '#F4F4F8' : '#0F0F17', border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '8px 14px', borderBottom: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, fontSize: 11, color: light ? '#9090A8' : '#3A3A5A', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>response.json</div>
        <pre style={{ padding: 16, fontFamily: 'var(--font-mono)', fontSize: 12, color: light ? '#0A0A0F' : '#F0F0F5', whiteSpace: 'pre-wrap', lineHeight: 1.6, minHeight: 120 }}>
          {jsonConfig ? JSON.stringify(jsonConfig, null, 2) : '{\n  "automation": null\n}'}
        </pre>
      </div>
      <style>{`@keyframes blink { 0%, 50% { opacity: 1 } 51%, 100% { opacity: 0 } } @media (max-width: 768px) { .terminal-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

export default function Landing() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const light = theme === 'light';
  const [annual, setAnnual] = useState(false);
  const muted = light ? '#9090A8' : '#3A3A5A';
  const secondary = light ? '#505070' : '#7070A0';
  const text = light ? '#0A0A0F' : '#F0F0F5';

  const marqueeItems = [
    'Send follow-up emails after purchases',
    'Auto-reply to support tickets',
    'Post revenue updates to Slack',
    'Generate weekly reports',
    'Sync form data to CRM',
    'Send abandoned cart reminders',
    'Route new leads to sales',
    'Alert team on failed payments',
    'Create tasks from GitHub issues',
    'Send onboarding sequences',
  ];

  return (
    <div style={{ background: light ? '#FAFAFA' : '#0A0A0F', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 24px', paddingTop: 64 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 40, alignItems: 'center' }} className="hero-grid">
          <div>
            <motion.span custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ fontSize: 11, fontWeight: 300, letterSpacing: 3, textTransform: 'uppercase', color: '#00E5CC', display: 'block', marginBottom: 20 }}>
              Automation infrastructure for modern businesses
            </motion.span>
            <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 'clamp(48px, 7vw, 96px)', letterSpacing: '-0.04em', lineHeight: 1, color: text, marginBottom: 24 }}>
              Your team of one<br />just became a<br />team of ten.
            </motion.h1>
            <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible" style={{ fontSize: 16, color: secondary, maxWidth: 460, lineHeight: 1.7, marginBottom: 32 }}>
              Nuro connects to your existing tools and automates the repetitive work that eats your day — customer emails, follow-ups, reports, data entry. You describe what should happen. Nuro makes it happen, every time.
            </motion.p>
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#00E5CC', fontSize: 15, fontWeight: 500, transition: 'gap 200ms' }}
                onMouseEnter={(e) => e.currentTarget.style.gap = '12px'}
                onMouseLeave={(e) => e.currentTarget.style.gap = '8px'}>
                Start automating <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.p custom={4} variants={fadeUp} initial="hidden" animate="visible" style={{ fontSize: 12, color: muted, marginTop: 20 }}>
              No credit card required · Setup in 5 minutes · Cancel anytime
            </motion.p>
          </div>
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="hero-mark">
            <NuroMark size={320} animate />
          </motion.div>
        </div>
      </section>

      {/* What Nuro Does */}
      <Section id="product">
        <hr style={{ border: 'none', borderTop: '1px solid #00E5CC', width: 60, marginBottom: 40 }} />
        <p style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: secondary, maxWidth: 600, lineHeight: 1.7, margin: '0 auto', textAlign: 'center' }}>
          Nuro is automation infrastructure. You connect your tools — Shopify, Gmail, Slack, Stripe, whatever you use — and define rules for what should happen when. New order comes in? Nuro sends the confirmation, updates your spreadsheet, and pings your team. No code. No extra hires. Just the work, getting done.
        </p>
        <div style={{ marginTop: 48, overflow: 'hidden', position: 'relative' }}>
          <div style={{ display: 'flex', gap: 40, animation: 'marquee 30s linear infinite', width: 'max-content' }}
            onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}>
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: secondary, whiteSpace: 'nowrap' }}>
                <span style={{ color: '#00E5CC', marginRight: 8 }}>—</span>{item}
              </span>
            ))}
          </div>
        </div>
        <style>{`@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
      </Section>

      {/* How It Works */}
      <Section id="how-it-works">
        {[
          { num: '01', title: 'Connect your tools', body: 'Link the apps you already use. Nuro supports webhooks, REST APIs, email, and native integrations with Shopify, Stripe, Slack, and more. Setup takes about two minutes per tool.', code: `curl -X POST https://api.nuro.ai/v1/integrations \\
  -H "Authorization: Bearer nuro_live_a8f3..." \\
  -d '{"type": "shopify", "store": "myshop.myshopify.com"}'` },
          { num: '02', title: 'Define your automations', body: 'Tell Nuro what should happen and when. Set a trigger — a webhook, a schedule, or a manual button — and chain the actions you want. Each automation is a simple JSON config.', code: `{
  "name": "Order follow-up",
  "trigger": { "type": "webhook", "event": "order.created" },
  "actions": [
    { "type": "email", "to": "{{customer.email}}",
      "subject": "Thanks for your order" },
    { "type": "slack", "channel": "#orders",
      "message": "New order: {{order.total}}" }
  ]
}` },
          { num: '03', title: 'Let it run', body: "Nuro executes your automations reliably, every time. Monitor runs in real-time, get failure alerts, and check detailed logs. If something breaks, you'll know in seconds — not days.", code: `GET /v1/logs?automation=order-followup&limit=5

{
  "logs": [
    { "status": "success", "duration": "1.24s",
      "timestamp": "2026-06-29T09:41:22Z" },
    { "status": "success", "duration": "0.98s",
      "timestamp": "2026-06-29T08:12:10Z" }
  ]
}` },
        ].map((step, i) => (
          <div key={step.num}>
            {i > 0 && <hr style={{ border: 'none', borderTop: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, margin: '60px 0' }} />}
            <div style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '5fr 7fr' : '7fr 5fr', gap: 48, alignItems: 'start' }} className="steps-grid">
              <div style={{ position: 'relative', order: i % 2 === 0 ? 0 : 1 }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 'clamp(80px, 12vw, 160px)', color: '#00E5CC', opacity: 0.08, position: 'absolute', top: -30, left: -10, lineHeight: 1, userSelect: 'none' }}>{step.num}</span>
                <div style={{ position: 'relative', zIndex: 1, paddingTop: 20 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 600, color: text, marginBottom: 12 }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: secondary, lineHeight: 1.7 }}>{step.body}</p>
                </div>
              </div>
              <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                <div style={{ background: light ? '#F4F4F8' : '#0F0F17', border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '6px 12px', borderBottom: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F57' }} />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FEBC2E' }} />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28C840' }} />
                  </div>
                  <pre style={{ padding: 16, fontFamily: 'var(--font-mono)', fontSize: 12, color: light ? '#0A0A0F' : '#F0F0F5', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>{step.code}</pre>
                </div>
              </div>
            </div>
          </div>
        ))}
        <style>{`@media (max-width: 768px) { .steps-grid { grid-template-columns: 1fr !important; } .steps-grid > * { order: 0 !important; } }`}</style>
      </Section>

      {/* Pricing */}
      <Section id="pricing" style={{ background: light ? '#F4F4F8' : '#0F0F17' }}>
        <span style={{ fontSize: 11, fontWeight: 300, letterSpacing: 3, textTransform: 'uppercase', color: muted, display: 'block', marginBottom: 12 }}>PRICING</span>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', color: text, marginBottom: 24 }}>Pay for what you use. Nothing else.</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <span style={{ fontSize: 13, color: annual ? muted : text }}>Monthly</span>
          <button onClick={() => setAnnual(!annual)} style={{ width: 40, height: 22, borderRadius: 11, background: annual ? '#00E5CC' : light ? '#E0E0EC' : '#1E1E2E', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 200ms' }}>
            <span style={{ position: 'absolute', top: 3, left: annual ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: annual ? '#0A0A0F' : '#7070A0', transition: 'left 200ms' }} />
          </button>
          <span style={{ fontSize: 13, color: annual ? text : muted }}>Annual <span style={{ color: '#00E5CC', fontSize: 11 }}>save 20%</span></span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {plans.map((plan, i) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            const highlighted = plan.name === 'Growth';
            return (
              <div key={plan.name} style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr', gap: 20, alignItems: 'center',
                padding: '20px 24px',
                background: highlighted ? (light ? '#FFFFFF' : '#141420') : 'transparent',
                borderLeft: highlighted ? '2px solid #00E5CC' : '2px solid transparent',
                borderRadius: highlighted ? 4 : 0,
              }} className="pricing-row">
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: text }}>{plan.name}</div>
                </div>
                <div>
                  <span style={{ fontSize: 28, fontWeight: 800, color: text }}>${price}</span>
                  {price > 0 && <span style={{ fontSize: 13, color: muted }}>/mo</span>}
                </div>
                <div style={{ fontSize: 13, color: secondary }}>
                  {plan.automations === -1 ? 'Unlimited automations' : `${plan.automations.toLocaleString()} automations/mo`} · {plan.apiCalls === -1 ? 'Unlimited API calls' : `${plan.apiCalls.toLocaleString()} API calls`} · {plan.teamMembers === -1 ? 'Unlimited seats' : `${plan.teamMembers} seat${plan.teamMembers > 1 ? 's' : ''}`}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Link to="/signup" style={{ fontSize: 13, color: '#00E5CC', fontWeight: 500 }}>
                    {plan.monthlyPrice === 0 ? 'Start free' : 'Choose plan'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: 13, color: muted, marginTop: 32, maxWidth: 500 }}>
          If you exceed your plan's automation limit, running automations pause until the next billing cycle. You'll get a warning at 80% usage. Upgrade anytime — changes take effect immediately.
        </p>
        <style>{`@media (max-width: 768px) { .pricing-row { grid-template-columns: 1fr 1fr !important; } }`}</style>
      </Section>

      {/* Integration Strip */}
      <Section>
        <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', color: text, marginBottom: 24 }}>Works with the tools you already use</h2>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#00E5CC', lineHeight: 2 }}>
          Shopify / Stripe / Gmail / Slack / Notion / Airtable / HubSpot / Zapier / WhatsApp / Telegram / PostgreSQL / Webhook / GitHub / Jira / Google Sheets / Mailchimp / Twilio / SendGrid
        </p>
      </Section>

      {/* Terminal Demo */}
      <Section style={{ background: light ? '#F4F4F8' : '#0F0F17' }}>
        <span style={{ fontSize: 11, fontWeight: 300, letterSpacing: 3, textTransform: 'uppercase', color: muted, display: 'block', marginBottom: 12 }}>LIVE DEMO</span>
        <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', color: text, marginBottom: 8 }}>Describe the work. Nuro builds the automation.</h2>
        <p style={{ fontSize: 14, color: secondary, marginBottom: 32 }}>Type a business problem below. Nuro will suggest how to automate it.</p>
        <TerminalDemo />
      </Section>

      {/* Mobile App Banner */}
      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 48, alignItems: 'center' }} className="mobile-grid">
          <div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', color: text, marginBottom: 12 }}>Manage automations on the go</h2>
            <p style={{ fontSize: 15, color: secondary, lineHeight: 1.7, marginBottom: 24 }}>Monitor runs, get failure alerts, and trigger manual automations from your phone.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['App Store', 'Google Play'].map(store => (
                <button key={store} onClick={() => addToast('Coming soon', 'info')} style={{
                  background: light ? '#0A0A0F' : '#141420', border: `1px solid ${light ? '#0A0A0F' : '#1E1E2E'}`, borderRadius: 8,
                  padding: '10px 20px', color: '#F0F0F5', fontSize: 13, fontWeight: 500,
                }}>{store}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 200, height: 360, borderRadius: 24, border: `2px solid ${light ? '#E0E0EC' : '#1E1E2E'}`,
              background: light ? '#FFFFFF' : '#0F0F17', padding: 12, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <NuroMark size={16} /><span style={{ fontSize: 10, fontWeight: 800, letterSpacing: -1, color: text }}>nuro</span>
              </div>
              <div style={{ fontSize: 8, color: muted, marginBottom: 6 }}>This month</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
                {[{ v: '3,247', l: 'Runs' }, { v: '98.2%', l: 'Success' }].map(s => (
                  <div key={s.l} style={{ background: light ? '#F4F4F8' : '#141420', borderRadius: 6, padding: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: text }}>{s.v}</div>
                    <div style={{ fontSize: 7, color: muted }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, background: light ? '#F4F4F8' : '#141420', borderRadius: 6, padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 7, color: muted, marginBottom: 2 }}>Recent</div>
                {['Order follow-up', 'Sales digest', 'Cart recovery'].map(n => (
                  <div key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 8, color: secondary }}>{n}</span>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#00E5CC' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 768px) { .mobile-grid { grid-template-columns: 1fr !important; } .hero-grid { grid-template-columns: 1fr !important; } .hero-mark { display: none !important; } }`}</style>
      </Section>

      <Footer />
    </div>
  );
}
