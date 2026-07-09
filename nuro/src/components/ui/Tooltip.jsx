import { useState, useRef } from 'react';
import { HelpCircle } from 'lucide-react';

export default function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  const ref = useRef();

  return (
    <span
      ref={ref}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <HelpCircle size={13} style={{ color: '#3A3A5A', cursor: 'help' }} />
      {show && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: 8,
          background: '#141420',
          border: '1px solid #1E1E2E',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 12,
          color: '#F0F0F5',
          maxWidth: 200,
          lineHeight: 1.5,
          zIndex: 100,
          whiteSpace: 'normal',
          animation: 'fadeIn 150ms ease',
          pointerEvents: 'none',
        }}>
          {text}
          <div style={{
            position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
            width: 8, height: 8, background: '#141420', borderRight: '1px solid #1E1E2E', borderBottom: '1px solid #1E1E2E',
          }} />
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </span>
  );
}
