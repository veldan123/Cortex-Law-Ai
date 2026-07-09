import { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function CodeBlock({ code, language = 'json', typewriter = false }) {
  const { theme } = useTheme();
  const light = theme === 'light';
  const [copied, setCopied] = useState(false);
  const [displayed, setDisplayed] = useState(typewriter ? '' : code);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!typewriter || hasAnimated.current) { setDisplayed(code); return; }
    hasAnimated.current = true;
    let i = 0;
    const interval = setInterval(() => {
      i += 2;
      setDisplayed(code.slice(0, i));
      if (i >= code.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [code, typewriter]);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', background: light ? '#F4F4F8' : '#0F0F17', border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', borderBottom: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}` }}>
        <span style={{ fontSize: 11, color: light ? '#9090A8' : '#3A3A5A', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{language}</span>
        <button onClick={copy} aria-label="Copy code" style={{ background: 'none', border: 'none', color: light ? '#505070' : '#7070A0', padding: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <pre style={{ padding: '14px 16px', margin: 0, overflow: 'auto', fontSize: 13, lineHeight: 1.6, fontFamily: 'var(--font-mono)', color: light ? '#0A0A0F' : '#F0F0F5' }}>
        <code>{displayed}</code>
      </pre>
    </div>
  );
}
