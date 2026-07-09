import { useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateUsageData } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';

export function ApiCallsChart() {
  const { theme } = useTheme();
  const light = theme === 'light';
  const data = useMemo(() => generateUsageData(30), []);
  return (
    <div>
      <h4 style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: light ? '#0A0A0F' : '#F0F0F5' }}>API calls over time</h4>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs><linearGradient id="apiFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00E5CC" stopOpacity={0.1} /><stop offset="100%" stopColor="#00E5CC" stopOpacity={0} /></linearGradient></defs>
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#3A3A5A' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: '#3A3A5A' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: light ? '#FFF' : '#141420', border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, borderRadius: 6, fontSize: 12 }} />
          <Area type="monotone" dataKey="apiCalls" stroke="#00E5CC" strokeWidth={1.5} fill="url(#apiFill)" animationDuration={800} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AutomationsByTypeChart() {
  const { theme } = useTheme();
  const light = theme === 'light';
  const data = [
    { type: 'Webhook', count: 2470 },
    { type: 'Schedule', count: 568 },
    { type: 'Manual', count: 142 },
  ];
  return (
    <div>
      <h4 style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: light ? '#0A0A0F' : '#F0F0F5' }}>Runs by trigger type</h4>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <XAxis dataKey="type" tick={{ fontSize: 10, fill: '#3A3A5A' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#3A3A5A' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: light ? '#FFF' : '#141420', border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, borderRadius: 6, fontSize: 12 }} />
          <Bar dataKey="count" fill="#00E5CC" radius={[4, 4, 0, 0]} animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SuccessRateChart() {
  const { theme } = useTheme();
  const light = theme === 'light';
  const data = useMemo(() => generateUsageData(30), []);
  return (
    <div>
      <h4 style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: light ? '#0A0A0F' : '#F0F0F5' }}>Success vs failure rate</h4>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#3A3A5A' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: '#3A3A5A' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: light ? '#FFF' : '#141420', border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, borderRadius: 6, fontSize: 12 }} />
          <Line type="monotone" dataKey="successes" stroke="#00E5CC" strokeWidth={1.5} dot={false} animationDuration={800} />
          <Line type="monotone" dataKey="failures" stroke="#FF4466" strokeWidth={1.5} dot={false} animationDuration={800} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UsageGauge({ used, total, label }) {
  const pct = total === -1 ? 15 : Math.min((used / total) * 100, 100);
  const radius = 60;
  const circumference = Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h4 style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: '#F0F0F5' }}>{label}</h4>
      <svg width={140} height={80} viewBox="0 0 140 80">
        <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke="#1E1E2E" strokeWidth={6} strokeLinecap="round" />
        <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke="#00E5CC" strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 800ms ease' }} />
        <text x="70" y="60" textAnchor="middle" fill="#F0F0F5" fontSize={18} fontWeight={700} fontFamily="Inter">{Math.round(pct)}%</text>
      </svg>
      <span style={{ fontSize: 11, color: '#3A3A5A', marginTop: 4 }}>
        {total === -1 ? 'Unlimited' : `${used.toLocaleString()} / ${total.toLocaleString()}`}
      </span>
    </div>
  );
}
