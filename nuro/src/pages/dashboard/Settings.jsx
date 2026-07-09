import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { teamMembers as initialTeam } from '../../data/mockData';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toggle from '../../components/ui/Toggle';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';

const tabs = ['General', 'Notifications', 'Team', 'Security', 'Danger Zone'];

export default function Settings() {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const { user } = useAuth();
  const light = theme === 'light';
  const text = light ? '#0A0A0F' : '#F0F0F5';
  const muted = light ? '#9090A8' : '#3A3A5A';
  const secondary = light ? '#505070' : '#7070A0';
  const border = light ? '#E0E0EC' : '#1E1E2E';

  const [activeTab, setActiveTab] = useState('General');
  const [general, setGeneral] = useState({ businessName: user?.businessName || '', website: '', industry: 'SaaS', timezone: 'Asia/Singapore' });
  const [notifs, setNotifs] = useState(() => JSON.parse(localStorage.getItem('nuro-notif-prefs') || '{"failures":true,"weekly":true,"billing":true,"team":false,"apiLocation":false}'));
  const [team, setTeam] = useState(initialTeam);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'viewer' });
  const [twoFA, setTwoFA] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [closeText, setCloseText] = useState('');

  useEffect(() => { localStorage.setItem('nuro-notif-prefs', JSON.stringify(notifs)); }, [notifs]);

  const Section = ({ label, children }) => (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: text, marginBottom: 14 }}>{label}</h3>
      {children}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: `1px solid ${border}`, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '8px 16px', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer',
            color: activeTab === t ? '#00E5CC' : secondary,
            borderBottom: activeTab === t ? '2px solid #00E5CC' : '2px solid transparent',
            marginBottom: -1, transition: 'all 200ms',
          }}>{t}</button>
        ))}
      </div>

      {activeTab === 'General' && (
        <div style={{ maxWidth: 500 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Business name" value={general.businessName} onChange={(e) => setGeneral({ ...general, businessName: e.target.value })} />
            <Input label="Website" value={general.website} onChange={(e) => setGeneral({ ...general, website: e.target.value })} placeholder="https://" />
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: muted, marginBottom: 6, display: 'block' }}>Industry</label>
              <select value={general.industry} onChange={(e) => setGeneral({ ...general, industry: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', background: light ? '#F4F4F8' : '#0F0F17', border: `1px solid ${border}`, borderRadius: 6, fontSize: 14, color: text, outline: 'none' }}>
                {['SaaS', 'E-commerce', 'Agency', 'Healthcare', 'Finance', 'Other'].map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <Input label="Timezone" value={general.timezone} onChange={(e) => setGeneral({ ...general, timezone: e.target.value })} />
            <Button onClick={() => addToast('Settings saved', 'success')} style={{ alignSelf: 'flex-start' }}>Save changes</Button>
          </div>
        </div>
      )}

      {activeTab === 'Notifications' && (
        <div style={{ maxWidth: 500 }}>
          {[
            { key: 'failures', label: 'Automation failure alerts' },
            { key: 'weekly', label: 'Weekly summary email' },
            { key: 'billing', label: 'Billing alerts' },
            { key: 'team', label: 'New team member added' },
            { key: 'apiLocation', label: 'API key used from new location' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${border}` }}>
              <span style={{ fontSize: 14, color: text }}>{item.label}</span>
              <Toggle checked={notifs[item.key]} onChange={(v) => setNotifs({ ...notifs, [item.key]: v })} />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Team' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button onClick={() => setInviteOpen(true)}>Invite member</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {team.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: light ? '#E0E0EC' : '#1E1E2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#00E5CC' }}>
                    {m.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, color: text }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: muted }}>{m.email}</div>
                  </div>
                </div>
                <Badge type={m.role}>{m.role}</Badge>
              </div>
            ))}
          </div>

          <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite team member" width={400}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input label="Email" type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} />
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: muted, marginBottom: 6, display: 'block' }}>Role</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['viewer', 'editor', 'admin'].map(r => (
                    <button key={r} onClick={() => setInviteForm({ ...inviteForm, role: r })} style={{
                      padding: '8px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize',
                      background: inviteForm.role === r ? 'rgba(0,229,204,0.08)' : 'transparent',
                      border: `1px solid ${inviteForm.role === r ? '#00E5CC' : border}`,
                      color: inviteForm.role === r ? '#00E5CC' : secondary,
                    }}>{r}</button>
                  ))}
                </div>
              </div>
              <Button onClick={() => {
                setTeam([...team, { id: `tm_${Date.now()}`, name: inviteForm.email.split('@')[0], email: inviteForm.email, role: inviteForm.role, joinedAt: new Date().toISOString() }]);
                addToast(`Invitation sent to ${inviteForm.email}`, 'success');
                setInviteOpen(false);
                setInviteForm({ email: '', role: 'viewer' });
              }} style={{ justifyContent: 'center' }}>Send invitation</Button>
            </div>
          </Modal>
        </div>
      )}

      {activeTab === 'Security' && (
        <div style={{ maxWidth: 500 }}>
          <Section label="Change password">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input label="Current password" type="password" />
              <Input label="New password" type="password" />
              <Input label="Confirm new password" type="password" />
              <Button onClick={() => addToast('Password updated', 'success')} style={{ alignSelf: 'flex-start' }}>Update password</Button>
            </div>
          </Section>

          <Section label="Two-factor authentication">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 14, color: text }}>Enable 2FA</span>
              <Toggle checked={twoFA} onChange={setTwoFA} />
            </div>
            {twoFA && (
              <div style={{ padding: 16, background: light ? '#F4F4F8' : '#0F0F17', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ width: 120, height: 120, background: '#FFFFFF', borderRadius: 8, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={100} height={100} viewBox="0 0 100 100">
                    {[...Array(100)].map((_, i) => (
                      <rect key={i} x={(i % 10) * 10} y={Math.floor(i / 10) * 10} width={8} height={8} fill={Math.random() > 0.5 ? '#000' : '#FFF'} />
                    ))}
                  </svg>
                </div>
                <p style={{ fontSize: 12, color: muted }}>Scan with your authenticator app</p>
              </div>
            )}
          </Section>

          <Section label="Active sessions">
            {[
              { device: 'Chrome on macOS', ip: '182.55.12.4', current: true },
              { device: 'Safari on iPhone', ip: '182.55.12.4', current: false },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${border}` }}>
                <div>
                  <div style={{ fontSize: 13, color: text }}>{s.device} {s.current && <Badge type="active">Current</Badge>}</div>
                  <div style={{ fontSize: 11, color: muted }}>{s.ip}</div>
                </div>
                {!s.current && <button onClick={() => addToast('Session revoked', 'success')} style={{ background: 'none', border: 'none', color: '#FF4466', fontSize: 12, cursor: 'pointer' }}>Revoke</button>}
              </div>
            ))}
          </Section>
        </div>
      )}

      {activeTab === 'Danger Zone' && (
        <div style={{ maxWidth: 500 }}>
          <div style={{ padding: 20, border: '1px solid rgba(255,68,102,0.2)', borderRadius: 8, marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#FF4466', marginBottom: 8 }}>Delete all data</h3>
            <p style={{ fontSize: 13, color: secondary, marginBottom: 12 }}>This permanently deletes all automations, logs, and API keys. Type DELETE to confirm.</p>
            <Input value={deleteText} onChange={(e) => setDeleteText(e.target.value)} placeholder='Type "DELETE"' />
            <Button variant="danger" disabled={deleteText !== 'DELETE'} onClick={() => { addToast('All data deleted', 'error'); setDeleteText(''); }} style={{ marginTop: 8 }}>Delete all data</Button>
          </div>

          <div style={{ padding: 20, border: '1px solid rgba(255,68,102,0.2)', borderRadius: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#FF4466', marginBottom: 8 }}>Close account</h3>
            <p style={{ fontSize: 13, color: secondary, marginBottom: 12 }}>This permanently closes your account. Type your email to confirm.</p>
            <Input value={closeText} onChange={(e) => setCloseText(e.target.value)} placeholder={user?.email || 'your@email.com'} />
            <Button variant="danger" disabled={closeText !== (user?.email || '')} onClick={() => { addToast('Account closed', 'error'); setCloseText(''); }} style={{ marginTop: 8 }}>Close account</Button>
          </div>
        </div>
      )}
    </div>
  );
}
