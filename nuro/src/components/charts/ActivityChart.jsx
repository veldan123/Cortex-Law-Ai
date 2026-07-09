import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateUsageData } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';

export default function ActivityChart() {
  const [range, setRange] = useState(30);
  const { theme } = useTheme();
  const light = theme === 'light';
  const data = useMemo(() => generateUsageData(range), [range]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 500, color: light ? '#0A0A0F' : '#F0F0F5' }}>Automation activity</h3>
        <div style={{ display: 'flex', gap: 4 }}>
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setRange(d)}
              style={{
                background: range === d ? 'rgba(0,229,204,0.1)' : 'transparent',
                border: `1px solid ${range === d ? '#00E5CC' : light ? '#E0E0EC' : '#1E1E2E'}`,
                borderRadius: 4, padding: '3px 8px', fontSize: 11, cursor: 'pointer',
                color: range === d ? '#00E5CC' : light ? '#505070' : '#7070A0',
              }}>{d}D</button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="runsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5CC" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#00E5CC" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: light ? '#9090A8' : '#3A3A5A' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11, fill: light ? '#9090A8' : '#3A3A5A' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: light ? '#FFFFFF' : '#141420', border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, borderRadius: 6, fontSize: 12, color: light ? '#0A0A0F' : '#F0F0F5' }}
            labelStyle={{ color: light ? '#505070' : '#7070A0' }}
          />
          <Area type="monotone" dataKey="runs" stroke="#00E5CC" strokeWidth={1.5} fill="url(#runsFill)" animationDuration={800} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
