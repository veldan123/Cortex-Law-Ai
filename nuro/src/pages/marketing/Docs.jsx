import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/layout/Navbar';
import CodeBlock from '../../components/ui/CodeBlock';
import Badge from '../../components/ui/Badge';

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'api-reference', label: 'API Reference' },
  { id: 'automations', label: 'Automations' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'rate-limits', label: 'Rate Limits' },
  { id: 'error-codes', label: 'Error Codes' },
  { id: 'sdks', label: 'SDKs' },
];

const endpoints = [
  { method: 'POST', path: '/automations/run', desc: 'Trigger an automation', params: [{ name: 'automation_id', type: 'string', required: true, desc: 'The automation to trigger' }, { name: 'payload', type: 'object', required: false, desc: 'Data to pass to the automation' }] },
  { method: 'GET', path: '/automations', desc: 'List all automations', params: [{ name: 'status', type: 'string', required: false, desc: 'Filter by status: active, paused' }, { name: 'limit', type: 'integer', required: false, desc: 'Max results (default 20)' }] },
  { method: 'POST', path: '/automations/create', desc: 'Create a new automation', params: [{ name: 'name', type: 'string', required: true, desc: 'Automation name' }, { name: 'trigger', type: 'object', required: true, desc: 'Trigger configuration' }, { name: 'actions', type: 'array', required: true, desc: 'Action sequence' }] },
  { method: 'DELETE', path: '/automations/{id}', desc: 'Delete an automation', params: [{ name: 'id', type: 'string', required: true, desc: 'Automation ID' }] },
  { method: 'GET', path: '/usage', desc: 'Get current usage stats', params: [] },
  { method: 'GET', path: '/logs', desc: 'Get automation run logs', params: [{ name: 'automation_id', type: 'string', required: false, desc: 'Filter by automation' }, { name: 'status', type: 'string', required: false, desc: 'Filter: success, failed' }] },
];

const errorCodes = [
  { code: 'auth_invalid', status: 401, meaning: 'API key is missing or invalid', fix: 'Check your Authorization header includes a valid key' },
  { code: 'auth_expired', status: 401, meaning: 'API key has been revoked', fix: 'Generate a new API key in the dashboard' },
  { code: 'not_found', status: 404, meaning: 'Resource does not exist', fix: 'Verify the ID in your request path' },
  { code: 'validation_error', status: 422, meaning: 'Request body is malformed', fix: 'Check required fields and types' },
  { code: 'rate_limited', status: 429, meaning: 'Too many requests', fix: 'Back off and retry with exponential delay' },
  { code: 'plan_limit', status: 429, meaning: 'Monthly automation limit reached', fix: 'Upgrade your plan or wait for the next cycle' },
  { code: 'internal_error', status: 500, meaning: 'Something went wrong on our end', fix: 'Retry the request; contact support if persistent' },
];

export default function Docs() {
  const { theme } = useTheme();
  const light = theme === 'light';
  const [active, setActive] = useState('introduction');
  const [langTab, setLangTab] = useState('curl');
  const text = light ? '#0A0A0F' : '#F0F0F5';
  const secondary = light ? '#505070' : '#7070A0';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const bg = light ? '#FFFFFF' : '#0A0A0F';
  const bgAlt = light ? '#F4F4F8' : '#0F0F17';
  const border = light ? '#E0E0EC' : '#1E1E2E';

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-80px 0px -60% 0px' });
    sections.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const H2 = ({ children, id }) => <h2 id={id} style={{ fontSize: 28, fontWeight: 700, color: text, marginBottom: 16, paddingTop: 80, marginTop: -60, letterSpacing: '-0.02em' }}>{children}</h2>;
  const H3 = ({ children }) => <h3 style={{ fontSize: 18, fontWeight: 600, color: text, marginBottom: 10, marginTop: 32 }}>{children}</h3>;
  const P = ({ children }) => <p style={{ fontSize: 15, color: secondary, lineHeight: 1.7, marginBottom: 16 }}>{children}</p>;

  const methodColors = { GET: '#00E5CC', POST: '#FFB020', DELETE: '#FF4466', PUT: '#A070FF' };

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', paddingTop: 64 }}>
        {/* Left sidebar */}
        <aside style={{ width: 240, flexShrink: 0, position: 'fixed', top: 64, bottom: 0, left: 0, borderRight: `1px solid ${border}`, padding: '24px 16px', overflowY: 'auto', background: bg }} className="docs-sidebar">
          <div style={{ fontSize: 11, fontWeight: 500, color: muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Documentation</div>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{
              display: 'block', padding: '6px 12px', fontSize: 13, borderRadius: 4, marginBottom: 2,
              color: active === s.id ? '#00E5CC' : secondary,
              background: active === s.id ? 'rgba(0,229,204,0.06)' : 'transparent',
              borderLeft: active === s.id ? '2px solid #00E5CC' : '2px solid transparent',
              transition: 'all 200ms',
            }}>{s.label}</a>
          ))}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, marginLeft: 240, marginRight: 180, padding: '32px 48px', maxWidth: 760 }} className="docs-main">
          <H2 id="introduction">Introduction</H2>
          <P>Nuro is an automation platform that connects your business tools and runs workflows automatically. Define a trigger, chain your actions, and let Nuro handle the rest — reliably, every time.</P>
          <H3>Quickstart</H3>
          <ol style={{ paddingLeft: 20, fontSize: 14, color: secondary, lineHeight: 2, marginBottom: 16 }}>
            <li>Create an account at nuro.ai</li>
            <li>Generate an API key in the dashboard</li>
            <li>Create your first automation</li>
            <li>Trigger it and watch it run</li>
          </ol>
          <CodeBlock language="bash" code={`# Install the CLI\nnpm install -g @nuro/cli\n\n# Authenticate\nnuro auth login\n\n# Create an automation\nnuro create --name "My first automation"`} />
          <P>The free Starter plan includes 500 automations per month — no credit card required.</P>

          <H2 id="authentication">Authentication</H2>
          <P>All API requests require a valid API key in the Authorization header. Keys follow the format <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: bgAlt, padding: '2px 6px', borderRadius: 4 }}>nuro_live_</code> for production and <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: bgAlt, padding: '2px 6px', borderRadius: 4 }}>nuro_test_</code> for test environments.</P>

          <div style={{ display: 'flex', gap: 0, marginBottom: 12, marginTop: 24 }}>
            {['curl', 'python', 'node'].map(t => (
              <button key={t} onClick={() => setLangTab(t)} style={{
                padding: '6px 14px', fontSize: 12, background: langTab === t ? bgAlt : 'transparent',
                border: `1px solid ${border}`, borderBottom: langTab === t ? `1px solid ${bgAlt}` : `1px solid ${border}`,
                color: langTab === t ? text : muted, cursor: 'pointer', textTransform: 'capitalize',
                borderRadius: t === 'curl' ? '6px 0 0 0' : t === 'node' ? '0 6px 0 0' : 0,
              }}>{t === 'curl' ? 'cURL' : t === 'node' ? 'Node.js' : 'Python'}</button>
            ))}
          </div>
          <CodeBlock language={langTab} code={
            langTab === 'curl' ? `curl https://api.nuro.ai/v1/automations \\
  -H "Authorization: Bearer nuro_live_your_key_here"` :
            langTab === 'python' ? `import requests\n\nresponse = requests.get(\n    "https://api.nuro.ai/v1/automations",\n    headers={"Authorization": "Bearer nuro_live_your_key_here"}\n)\nprint(response.json())` :
            `const response = await fetch("https://api.nuro.ai/v1/automations", {\n  headers: { "Authorization": "Bearer nuro_live_your_key_here" }\n});\nconst data = await response.json();`
          } />

          <H3>Security checklist</H3>
          <ul style={{ paddingLeft: 20, fontSize: 14, color: secondary, lineHeight: 2 }}>
            <li>Never expose API keys in client-side code</li>
            <li>Use test keys for development</li>
            <li>Rotate keys regularly</li>
            <li>Use the minimum permissions needed</li>
          </ul>

          <H2 id="api-reference">API Reference</H2>
          <P>Base URL: <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, background: bgAlt, padding: '2px 6px', borderRadius: 4 }}>https://api.nuro.ai/v1</code></P>

          {endpoints.map(ep => (
            <div key={ep.path} style={{ marginTop: 32, padding: 20, background: bgAlt, border: `1px solid ${border}`, borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: methodColors[ep.method], background: `${methodColors[ep.method]}15`, padding: '2px 8px', borderRadius: 4 }}>{ep.method}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: text }}>{ep.path}</span>
              </div>
              <P>{ep.desc}</P>
              {ep.params.length > 0 && (
                <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                  <thead><tr style={{ borderBottom: `1px solid ${border}` }}>
                    {['Parameter', 'Type', 'Required', 'Description'].map(h => <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: muted, fontWeight: 500, fontSize: 11 }}>{h}</th>)}
                  </tr></thead>
                  <tbody>{ep.params.map(p => (
                    <tr key={p.name} style={{ borderBottom: `1px solid ${border}` }}>
                      <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono)', color: text }}>{p.name}</td>
                      <td style={{ padding: '6px 8px', color: muted }}>{p.type}</td>
                      <td style={{ padding: '6px 8px', color: p.required ? '#00E5CC' : muted }}>{p.required ? 'Yes' : 'No'}</td>
                      <td style={{ padding: '6px 8px', color: secondary }}>{p.desc}</td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </div>
          ))}

          <H2 id="automations">Automations</H2>
          <P>An automation is a trigger-action pair. When the trigger fires, Nuro executes the action sequence in order. If any action fails, execution stops and the failure is logged.</P>
          <H3>Automation config schema</H3>
          <CodeBlock language="json" code={`{
  "name": "string",
  "trigger": {
    "type": "webhook | schedule | event | manual",
    "config": {}
  },
  "actions": [
    {
      "type": "http | email | slack | database | ai_response",
      "config": {}
    }
  ],
  "status": "active | paused",
  "retry": { "max_attempts": 3, "delay_ms": 1000 }
}`} />
          <H3>Trigger types</H3>
          <ul style={{ paddingLeft: 20, fontSize: 14, color: secondary, lineHeight: 2 }}>
            <li><strong style={{ color: text }}>webhook</strong> — Fires when an HTTP request hits your webhook URL</li>
            <li><strong style={{ color: text }}>schedule</strong> — Fires on a cron schedule (e.g. <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>0 9 * * 1-5</code>)</li>
            <li><strong style={{ color: text }}>event</strong> — Fires when an integration event occurs (e.g. new Shopify order)</li>
            <li><strong style={{ color: text }}>manual</strong> — Fires when triggered from the dashboard or API</li>
          </ul>
          <H3>Action types</H3>
          <ul style={{ paddingLeft: 20, fontSize: 14, color: secondary, lineHeight: 2 }}>
            <li><strong style={{ color: text }}>http</strong> — Make an HTTP request to any URL</li>
            <li><strong style={{ color: text }}>email</strong> — Send an email via Nuro's mail service</li>
            <li><strong style={{ color: text }}>slack</strong> — Post a message to a Slack channel</li>
            <li><strong style={{ color: text }}>database</strong> — Write to a connected database</li>
            <li><strong style={{ color: text }}>ai_response</strong> — Generate a response using Claude</li>
          </ul>

          <H2 id="webhooks">Webhooks</H2>
          <P>Nuro sends webhook events for automation lifecycle changes. Configure your endpoint in the dashboard under Settings.</P>
          <H3>Available events</H3>
          <ul style={{ paddingLeft: 20, fontSize: 14, color: secondary, lineHeight: 2 }}>
            <li>automation.run.started</li>
            <li>automation.run.completed</li>
            <li>automation.run.failed</li>
            <li>automation.created</li>
            <li>automation.deleted</li>
          </ul>
          <H3>Signature verification</H3>
          <P>Every webhook includes a <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>X-Nuro-Signature</code> header. Verify it using HMAC-SHA256 with your webhook secret.</P>
          <H3>Retry logic</H3>
          <P>Failed webhook deliveries are retried 3 times with exponential backoff: 1s, 10s, 60s.</P>

          <H2 id="rate-limits">Rate Limits</H2>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead><tr style={{ borderBottom: `1px solid ${border}` }}>
              {['Plan', 'Requests/min', 'Automations/mo', 'API calls/mo'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px', color: muted, fontWeight: 500 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {[['Starter', '60', '500', '1,000'], ['Growth', '300', '10,000', '50,000'], ['Scale', '1,000', 'Unlimited', 'Unlimited']].map(r => (
                <tr key={r[0]} style={{ borderBottom: `1px solid ${border}` }}>
                  {r.map((c, i) => <td key={i} style={{ padding: '8px', color: i === 0 ? text : secondary }}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <P>Rate limit info is included in response headers: <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>X-RateLimit-Remaining</code>, <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>X-RateLimit-Reset</code>.</P>

          <H2 id="error-codes">Error Codes</H2>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: `1px solid ${border}` }}>
              {['Code', 'HTTP', 'Meaning', 'Fix'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px', color: muted, fontWeight: 500 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {errorCodes.map(e => (
                <tr key={e.code} style={{ borderBottom: `1px solid ${border}` }}>
                  <td style={{ padding: '8px', fontFamily: 'var(--font-mono)', color: text, fontSize: 12 }}>{e.code}</td>
                  <td style={{ padding: '8px', color: e.status >= 500 ? '#FF4466' : secondary }}>{e.status}</td>
                  <td style={{ padding: '8px', color: secondary }}>{e.meaning}</td>
                  <td style={{ padding: '8px', color: secondary }}>{e.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <H2 id="sdks">SDKs</H2>
          <P>Official SDKs are available for the most common languages.</P>
          <CodeBlock language="bash" code={`# Node.js\nnpm install @nuro/sdk\n\n# Python\npip install nuro-sdk\n\n# Go\ngo get github.com/nuro-ai/nuro-go`} />
          <CodeBlock language="javascript" code={`import { Nuro } from '@nuro/sdk';\n\nconst nuro = new Nuro({ apiKey: process.env.NURO_API_KEY });\n\nconst result = await nuro.automations.run('auto_1', {\n  payload: { customer_id: 'cust_abc123' }\n});\n\nconsole.log(result.status); // "success"`} />
        </main>

        {/* Right sidebar - on this page */}
        <aside style={{ width: 180, flexShrink: 0, position: 'fixed', top: 64, right: 0, bottom: 0, padding: '24px 16px', overflowY: 'auto' }} className="docs-toc">
          <div style={{ fontSize: 11, fontWeight: 500, color: muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>On this page</div>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{
              display: 'block', padding: '4px 0', fontSize: 12,
              color: active === s.id ? '#00E5CC' : muted,
              transition: 'color 200ms',
            }}>{s.label}</a>
          ))}
        </aside>
      </div>
      <style>{`@media (max-width: 1024px) { .docs-toc { display: none; } .docs-main { margin-right: 0 !important; } } @media (max-width: 768px) { .docs-sidebar { display: none; } .docs-main { margin-left: 0 !important; padding: 24px !important; } }`}</style>
    </div>
  );
}
