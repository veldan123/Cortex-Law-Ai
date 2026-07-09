import { useToast } from '../../context/ToastContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const borderColors = {
  success: '#00E5CC',
  error: '#FF4466',
  warning: '#FFB020',
  info: '#7070A0',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const { theme } = useTheme();
  const bg = theme === 'light' ? '#FFFFFF' : '#141420';
  const border = theme === 'light' ? '#E0E0EC' : '#1E1E2E';
  const text = theme === 'light' ? '#0A0A0F' : '#F0F0F5';

  return (
    <div style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onClick={() => removeToast(t.id)}
            style={{
              background: bg,
              border: `1px solid ${border}`,
              borderLeft: `3px solid ${borderColors[t.type] || borderColors.info}`,
              borderRadius: 6,
              padding: '10px 16px',
              fontSize: 13,
              color: text,
              cursor: 'pointer',
              maxWidth: 320,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
