export const automations = [
  { id: 'auto_1', name: 'New order follow-up', trigger: 'webhook', triggerConfig: { url: 'https://hooks.nuro.ai/wh_8f3ka9m2' }, action: 'email', actionConfig: { to: 'customer', subject: 'Thanks for your order', body: 'Hi {{name}}, your order #{{order_id}} is confirmed.' }, status: 'active', lastRun: '2026-06-29T08:41:22Z', runCount: 1847, successRate: 98.2, avgDuration: 1.24, category: 'E-commerce' },
  { id: 'auto_2', name: 'Daily sales digest', trigger: 'schedule', triggerConfig: { cron: '0 9 * * *' }, action: 'slack', actionConfig: { channel: '#revenue', message: 'Daily sales: {{total_sales}} from {{order_count}} orders' }, status: 'active', lastRun: '2026-06-29T09:00:01Z', runCount: 412, successRate: 99.8, avgDuration: 2.1, category: 'Finance' },
  { id: 'auto_3', name: 'Abandoned cart recovery', trigger: 'webhook', triggerConfig: { url: 'https://hooks.nuro.ai/wh_k2m4p8q1' }, action: 'email', actionConfig: { to: 'customer', subject: 'You left something behind', body: 'Complete your purchase and get 10% off.' }, status: 'active', lastRun: '2026-06-29T07:22:10Z', runCount: 623, successRate: 97.1, avgDuration: 1.8, category: 'E-commerce' },
  { id: 'auto_4', name: 'Support ticket auto-reply', trigger: 'webhook', triggerConfig: { url: 'https://hooks.nuro.ai/wh_n5r7t3v9' }, action: 'ai_response', actionConfig: { model: 'claude-sonnet-4-6', prompt: 'Acknowledge the ticket and provide initial troubleshooting.' }, status: 'paused', lastRun: '2026-06-28T14:55:33Z', runCount: 289, successRate: 94.5, avgDuration: 3.2, category: 'Customer Support' },
  { id: 'auto_5', name: 'Invoice overdue reminder', trigger: 'schedule', triggerConfig: { cron: '0 10 * * 1,4' }, action: 'email', actionConfig: { to: 'client', subject: 'Payment reminder', body: 'Invoice #{{invoice_id}} is overdue. Please remit payment.' }, status: 'active', lastRun: '2026-06-27T10:00:02Z', runCount: 156, successRate: 100, avgDuration: 0.9, category: 'Finance' },
];

const statusOptions = ['success', 'success', 'success', 'success', 'success', 'success', 'success', 'failed'];
const triggerOptions = ['webhook', 'schedule', 'manual'];
const errorMessages = [
  'SMTP connection timeout after 30s',
  'Slack API returned 429: Rate limited',
  'Webhook payload validation failed: missing field "email"',
  'AI response exceeded token limit',
  'Target endpoint returned 503: Service unavailable',
];

export const generateLogs = () => {
  const logs = [];
  const now = Date.now();
  for (let i = 0; i < 50; i++) {
    const auto = automations[Math.floor(Math.random() * automations.length)];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const ts = new Date(now - i * 1800000 - Math.random() * 600000);
    logs.push({
      id: `log_${i}`,
      automationId: auto.id,
      automationName: auto.name,
      trigger: auto.trigger,
      status,
      duration: +(Math.random() * 4 + 0.3).toFixed(2),
      timestamp: ts.toISOString(),
      request: { event: auto.trigger, payload: { customer_id: `cust_${Math.random().toString(36).slice(2, 8)}`, order_id: `ord_${1000 + i}` } },
      response: status === 'success' ? { status: 200, message: 'Action completed' } : { status: 500, error: errorMessages[Math.floor(Math.random() * errorMessages.length)] },
      error: status === 'failed' ? errorMessages[Math.floor(Math.random() * errorMessages.length)] : null,
      steps: [
        { name: 'Trigger received', time: 0, status: 'success' },
        { name: 'Payload validated', time: 12, status: 'success' },
        { name: 'Action executed', time: 340 + Math.floor(Math.random() * 800), status },
        ...(status === 'success' ? [{ name: 'Response logged', time: 50, status: 'success' }] : []),
      ],
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const apiKeys = [
  { id: 'key_1', name: 'Production', key: 'nuro_live_a8f3k9m2p4q7r1s5t8u2v6w3x9y0z4', environment: 'live', created: '2026-05-12T10:00:00Z', lastUsed: '2026-06-29T08:41:22Z', status: 'active', permissions: ['automations:read', 'automations:write', 'logs:read'] },
  { id: 'key_2', name: 'Staging', key: 'nuro_live_b7c2d4e6f8g1h3j5k7l9m2n4p6q8r0', environment: 'live', created: '2026-06-01T14:30:00Z', lastUsed: '2026-06-28T16:12:45Z', status: 'active', permissions: ['automations:read', 'automations:write'] },
  { id: 'key_3', name: 'Testing', key: 'nuro_test_x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5', environment: 'test', created: '2026-06-15T09:00:00Z', lastUsed: '2026-06-25T11:30:00Z', status: 'active', permissions: ['automations:read'] },
];

export const generateUsageData = (days = 30) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const weekday = d.getDay();
    const base = weekday === 0 || weekday === 6 ? 40 : 120;
    const trend = (days - i) * 2;
    data.push({
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      runs: Math.floor(base + trend + (Math.random() - 0.3) * 40),
      apiCalls: Math.floor((base + trend) * 3 + Math.random() * 100),
      successes: Math.floor(base + trend + (Math.random() - 0.3) * 40),
      failures: Math.floor(Math.random() * 8),
    });
  }
  return data;
};

export const teamMembers = [
  { id: 'tm_1', name: 'Veldan Lee', email: 'veldan@nuro.ai', role: 'admin', avatar: null, joinedAt: '2026-05-01T00:00:00Z' },
  { id: 'tm_2', name: 'Joel Martinez', email: 'joel@company.com', role: 'editor', avatar: null, joinedAt: '2026-05-20T00:00:00Z' },
  { id: 'tm_3', name: 'Sarah Chen', email: 'sarah@company.com', role: 'viewer', avatar: null, joinedAt: '2026-06-10T00:00:00Z' },
];

export const notifications = [
  { id: 'n_1', type: 'automation', icon: 'Zap', title: 'Automation failed', body: 'New order follow-up failed: SMTP connection timeout', timestamp: '2026-06-29T09:39:00Z', read: false, link: '/dashboard/logs' },
  { id: 'n_2', type: 'warning', icon: 'AlertTriangle', title: 'Usage at 80%', body: "You've used 4,012 of 5,000 automations this month", timestamp: '2026-06-29T08:00:00Z', read: false, link: '/dashboard/usage' },
  { id: 'n_3', type: 'team', icon: 'Users', title: 'Invitation accepted', body: 'Joel Martinez joined your workspace', timestamp: '2026-06-29T06:00:00Z', read: true, link: '/dashboard/settings' },
  { id: 'n_4', type: 'billing', icon: 'CreditCard', title: 'Payment received', body: 'Invoice #1003 for $49.00 was paid', timestamp: '2026-06-28T12:00:00Z', read: true, link: '/dashboard/billing' },
];

export const invoices = [
  { id: 'INV-1001', date: '2026-04-01', amount: 49, status: 'paid', plan: 'Growth' },
  { id: 'INV-1002', date: '2026-05-01', amount: 49, status: 'paid', plan: 'Growth' },
  { id: 'INV-1003', date: '2026-06-01', amount: 49, status: 'paid', plan: 'Growth' },
];

export const auditEntries = [
  { id: 'aud_1', timestamp: '2026-06-29T09:41:22Z', user: 'veldan@nuro.ai', action: 'automation.run', details: "Automation 'New order follow-up' triggered via webhook", ip: '182.55.12.4' },
  { id: 'aud_2', timestamp: '2026-06-29T08:00:00Z', user: 'system', action: 'usage.warning', details: 'Usage threshold reached: 80%', ip: '-' },
  { id: 'aud_3', timestamp: '2026-06-28T16:12:45Z', user: 'veldan@nuro.ai', action: 'apikey.create', details: 'API key "Staging" created', ip: '182.55.12.4' },
  { id: 'aud_4', timestamp: '2026-06-28T14:00:00Z', user: 'veldan@nuro.ai', action: 'automation.update', details: "Automation 'Support ticket auto-reply' paused", ip: '182.55.12.4' },
  { id: 'aud_5', timestamp: '2026-06-27T10:00:00Z', user: 'veldan@nuro.ai', action: 'team.invite', details: 'Invited sarah@company.com as viewer', ip: '182.55.12.4' },
  { id: 'aud_6', timestamp: '2026-06-26T09:30:00Z', user: 'joel@company.com', action: 'automation.create', details: "Automation 'Daily sales digest' created", ip: '203.12.44.8' },
  { id: 'aud_7', timestamp: '2026-06-25T11:00:00Z', user: 'veldan@nuro.ai', action: 'billing.upgrade', details: 'Plan upgraded from Starter to Growth', ip: '182.55.12.4' },
  { id: 'aud_8', timestamp: '2026-06-20T14:00:00Z', user: 'veldan@nuro.ai', action: 'settings.update', details: 'Timezone changed to Asia/Singapore', ip: '182.55.12.4' },
];

export const templates = [
  { id: 'tpl_1', name: 'Order confirmation email', description: 'Send a thank-you email when a new Shopify order comes in', trigger: 'webhook', action: 'email', category: 'E-commerce' },
  { id: 'tpl_2', name: 'Form to CRM', description: 'Add new form submissions to your CRM automatically', trigger: 'webhook', action: 'http', category: 'Marketing' },
  { id: 'tpl_3', name: 'Overdue invoice reminder', description: 'Email clients when their invoice is past due', trigger: 'schedule', action: 'email', category: 'Finance' },
  { id: 'tpl_4', name: 'Revenue Slack alert', description: 'Post new Stripe payments to your team Slack channel', trigger: 'webhook', action: 'slack', category: 'Finance' },
  { id: 'tpl_5', name: 'Ticket auto-acknowledgement', description: 'Send an instant reply when a support ticket is created', trigger: 'webhook', action: 'ai_response', category: 'Customer Support' },
  { id: 'tpl_6', name: 'Weekly sales report', description: 'Generate and email a weekly sales summary every Monday', trigger: 'schedule', action: 'email', category: 'Finance' },
  { id: 'tpl_7', name: 'GitHub to Notion', description: 'Create a Notion task for every new GitHub issue', trigger: 'webhook', action: 'http', category: 'Operations' },
  { id: 'tpl_8', name: 'Cart recovery email', description: 'Send a recovery email one hour after cart abandonment', trigger: 'webhook', action: 'email', category: 'E-commerce' },
  { id: 'tpl_9', name: 'New hire onboarding', description: 'Send an onboarding email sequence to new team members', trigger: 'webhook', action: 'email', category: 'HR' },
  { id: 'tpl_10', name: 'Low stock Slack alert', description: 'Notify purchasing when inventory drops below threshold', trigger: 'webhook', action: 'slack', category: 'Operations' },
  { id: 'tpl_11', name: 'Review to Slack', description: 'Post new Google reviews to an internal Slack channel', trigger: 'webhook', action: 'slack', category: 'Marketing' },
  { id: 'tpl_12', name: 'Monthly client report', description: 'Generate and send a monthly performance report to clients', trigger: 'schedule', action: 'email', category: 'Operations' },
];

export const referrals = [
  { email: 'maria@startup.io', date: '2026-06-15', status: 'converted', credit: 20 },
  { email: 'alex@shop.co', date: '2026-06-20', status: 'signed_up', credit: 0 },
  { email: 'nina@agency.com', date: '2026-06-25', status: 'pending', credit: 0 },
];

export const plans = [
  { name: 'Starter', monthlyPrice: 0, annualPrice: 0, automations: 500, apiCalls: 1000, teamMembers: 1 },
  { name: 'Growth', monthlyPrice: 49, annualPrice: 39, automations: 10000, apiCalls: 50000, teamMembers: 5 },
  { name: 'Scale', monthlyPrice: 149, annualPrice: 119, automations: -1, apiCalls: -1, teamMembers: -1 },
];
