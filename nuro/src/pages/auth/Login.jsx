import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { NuroWordmark } from '../../components/ui/NuroLogo';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const { theme } = useTheme();
  const light = theme === 'light';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Fill in all fields'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    login(email, password);
    addToast('Signed in', 'success');
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: light ? '#FAFAFA' : '#0A0A0F' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <NuroWordmark size={32} />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: light ? '#0A0A0F' : '#F0F0F5', marginTop: 16 }}>Sign in to Nuro</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div style={{ position: 'relative' }}>
            <Input label="Password" type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPass(!showPass)} aria-label="Toggle password" style={{ position: 'absolute', right: 12, top: 30, background: 'none', border: 'none', color: light ? '#505070' : '#7070A0', padding: 4 }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <span style={{ fontSize: 12, color: '#FF4466' }}>{error}</span>}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setForgotOpen(true)} style={{ background: 'none', border: 'none', fontSize: 12, color: '#00E5CC', cursor: 'pointer' }}>Forgot password?</button>
          </div>

          <Button variant="primary" loading={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div style={{ marginTop: 20, padding: 12, background: light ? '#F4F4F8' : '#0F0F17', border: `1px solid ${light ? '#E0E0EC' : '#1E1E2E'}`, borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 12, color: light ? '#505070' : '#7070A0', textAlign: 'center' }}>
          demo@nuro.ai / password123
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: light ? '#505070' : '#7070A0', marginTop: 24 }}>
          No account? <Link to="/signup" style={{ color: '#00E5CC' }}>Sign up</Link>
        </p>
      </div>

      <Modal open={forgotOpen} onClose={() => { setForgotOpen(false); setForgotSent(false); }} title="Reset password" width={400}>
        {forgotSent ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <p style={{ fontSize: 14, color: light ? '#0A0A0F' : '#F0F0F5', marginBottom: 8 }}>Check your email</p>
            <p style={{ fontSize: 13, color: light ? '#505070' : '#7070A0' }}>We sent a reset link to {forgotEmail}</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setForgotSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Email address" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
            <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }}>Send reset link</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
