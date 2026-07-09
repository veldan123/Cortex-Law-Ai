import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { NuroLogoFull } from '../ui/NuroLogo';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const light = theme === 'light';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { label: 'Product', href: '#product' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '/docs' },
    { label: 'Status', href: '/status' },
  ];

  const navBg = scrolled
    ? light ? 'rgba(250,250,250,0.85)' : 'rgba(10,10,15,0.85)'
    : 'transparent';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: navBg,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}` : '1px solid transparent',
        transition: 'all 200ms ease',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <NuroLogoFull />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="nav-desktop">
            {links.map(l => (
              <a key={l.label} href={l.href} onClick={(e) => {
                if (l.href.startsWith('/')) { e.preventDefault(); navigate(l.href); }
              }} style={{
                fontSize: 13, color: light ? '#505070' : '#7070A0', fontWeight: 400,
                transition: 'color 200ms', position: 'relative', padding: '4px 0',
              }}
              onMouseEnter={(e) => e.target.style.color = light ? '#0A0A0F' : '#F0F0F5'}
              onMouseLeave={(e) => e.target.style.color = light ? '#505070' : '#7070A0'}
              >{l.label}</a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="nav-desktop">
            <button onClick={toggle} aria-label="Toggle theme" style={{ background: 'none', border: 'none', color: light ? '#505070' : '#7070A0', padding: 4, display: 'flex' }}>
              {light ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <Link to="/login" style={{ fontSize: 13, color: light ? '#505070' : '#7070A0' }}>Sign in</Link>
            <Link to="/signup" style={{
              fontSize: 13, color: '#00E5CC', border: '1px solid #00E5CC', padding: '6px 14px',
              borderRadius: 6, transition: 'all 200ms',
            }}>Get access</Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" className="nav-mobile-btn"
            style={{ background: 'none', border: 'none', color: light ? '#0A0A0F' : '#F0F0F5', display: 'none', padding: 4 }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, top: 64, zIndex: 99,
          background: light ? '#FAFAFA' : '#0A0A0F',
          display: 'flex', flexDirection: 'column', padding: '32px 24px', gap: 24,
        }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={(e) => {
              setMobileOpen(false);
              if (l.href.startsWith('/')) { e.preventDefault(); navigate(l.href); }
            }} style={{ fontSize: 20, fontWeight: 600, color: light ? '#0A0A0F' : '#F0F0F5' }}>{l.label}</a>
          ))}
          <hr style={{ border: 'none', borderTop: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}` }} />
          <Link to="/login" onClick={() => setMobileOpen(false)} style={{ fontSize: 16, color: light ? '#505070' : '#7070A0' }}>Sign in</Link>
          <Link to="/signup" onClick={() => setMobileOpen(false)} style={{ fontSize: 16, color: '#00E5CC' }}>Get access</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
