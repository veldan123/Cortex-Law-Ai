import { Link } from 'react-router-dom';
import { NuroLogoFull } from '../ui/NuroLogo';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  const light = theme === 'light';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const secondary = light ? '#505070' : '#7070A0';

  return (
    <footer style={{ borderTop: '1px solid #00E5CC', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
          <NuroLogoFull />
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Product', href: '#product' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'Docs', href: '/docs' },
              { label: 'Status', href: '/status' },
              { label: 'Blog', href: '#' },
            ].map(l => (
              <Link key={l.label} to={l.href} style={{ fontSize: 13, color: secondary }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: muted }}>
          <span>&copy; 2026 Nuro. All rights reserved.</span>
          <span>nuro.ai</span>
        </div>
      </div>
    </footer>
  );
}
