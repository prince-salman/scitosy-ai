"use client";

import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existingUsers = JSON.parse(localStorage.getItem('scitosy_users') ?? '[]');
    if (existingUsers.length === 0) {
      localStorage.setItem('scitosy_users', JSON.stringify([{ name: 'Juri / Penilai', email: 'demo@scitosy.com', password: 'password123' }]));
    }

    const session = localStorage.getItem('scitosy_session');
    if (session) {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  const getUsers = () => JSON.parse(localStorage.getItem('scitosy_users') ?? '[]');

  const login = (email, password) => {
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      return { ok: false, msg: 'Email atau kata sandi salah.' };
    }

    const sessionData = { name: foundUser.name, email: foundUser.email };
    localStorage.setItem('scitosy_session', JSON.stringify(sessionData));
    setUser(sessionData);
    return { ok: true };
  };

  const register = (name, email, password) => {
    const users = getUsers();
    if (users.some(u => u.email === email)) {
      return { ok: false, msg: 'Email sudah terdaftar.' };
    }

    localStorage.setItem('scitosy_users', JSON.stringify([...users, { name, email, password }]));
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('scitosy_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
