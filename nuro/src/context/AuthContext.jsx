import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nuro-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [onboarded, setOnboarded] = useState(() => localStorage.getItem('nuro-onboarded') === 'true');

  useEffect(() => {
    if (user) localStorage.setItem('nuro-user', JSON.stringify(user));
    else localStorage.removeItem('nuro-user');
  }, [user]);

  const login = (email, password) => {
    if ((email === 'demo@nuro.ai' && password === 'password123') || user) {
      const u = { name: 'Veldan Lee', email, plan: 'Growth', businessName: 'Nuro Demo', role: 'admin' };
      setUser(u);
      return true;
    }
    const u = { name: email.split('@')[0], email, plan: 'Growth', businessName: 'My Business', role: 'admin' };
    setUser(u);
    return true;
  };

  const signup = (data) => {
    const u = { name: data.businessName, email: data.email, plan: 'Starter', businessName: data.businessName, role: 'admin' };
    setUser(u);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nuro-user');
    localStorage.removeItem('nuro-onboarded');
    setOnboarded(false);
  };

  const completeOnboarding = () => {
    setOnboarded(true);
    localStorage.setItem('nuro-onboarded', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, onboarded, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
