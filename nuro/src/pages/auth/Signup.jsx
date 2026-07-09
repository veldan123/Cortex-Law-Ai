import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { NuroWordmark } from '../../components/ui/NuroLogo';

function passwordStrength(p) {
  if (!p) return null;
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (score <= 1) return { label: 'Weak', color: '#FF4466' };
  if (score <= 2) return { label: 'Fair', color: '#FFB020' };
  return { label: 'Strong', color: '#00E5CC' };
}

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { addToast } = useToast();
  const { theme } = useTheme();
  const light = theme === 'light';

  const [form, setForm] = useState({ businessName: '', email: '', password: '', confirmPassword: '', terms: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const validate = (field, value) => {
    const errs = { ...errors };
    if (field === 'email') {
      errs.email = !value ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email' : '';
    }
    if (field === 'password') {
      errs.password = value.length < 6 ? 'At least 6 characters' : '';
    }
    if (field === 'confirmPassword') {
      errs.confirmPassword = value !== form.password ? 'Passwords do not match' : '';
    }
    if (field === 'businessName') {
      errs.businessName = !value.trim() ? 'Required' : '';
    }
    setErrors(errs);
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validate(field, form[field]);
  };

  const isValid = form.businessName && form.email && form.password.length >= 6 && form.password === form.confirmPassword && form.terms && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) === false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    signup(form);
    addToast('Welcome to Nuro', 'success');
    navigate('/onboarding');
  };

  const strength = passwordStrength(form.password);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: light ? '#FAFAFA' : '#0A0A0F' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <NuroWordmark size={32} />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: light ? '#0A0A0F' : '#F0F0F5', marginTop: 16 }}>Start automating in minutes</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} onBlur={() => handleBlur('businessName')} error={touched.businessName ? errors.businessName : ''} />
          <Input label="Work email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onBlur={() => handleBlur('email')} error={touched.email ? errors.email : ''} />
          <div>
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onBlur={() => handleBlur('password')} error={touched.password ? errors.password : ''} />
            {strength && <span style={{ fontSize: 12, color: strength.color, marginTop: 4, display: 'block' }}>{strength.label}</span>}
          </div>
          <Input label="Confirm password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} onBlur={() => handleBlur('confirmPassword')} error={touched.confirmPassword ? errors.confirmPassword : ''} />

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: light ? '#505070' : '#7070A0', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} style={{ accentColor: '#00E5CC' }} />
            I agree to the Terms of Service and Privacy Policy
          </label>

          <Button variant="primary" disabled={!isValid} loading={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8 }}>
            {loading ? 'Creating your account...' : 'Create account'}
          </Button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: light ? '#505070' : '#7070A0', marginTop: 24 }}>
          Already have an account? <Link to="/login" style={{ color: '#00E5CC' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
