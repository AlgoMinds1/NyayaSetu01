import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nyayasetu_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default to AICTE official for impressive first impression of the problem statement!
    return DEMO_USERS[0];
  });

  const switchRole = (role) => {
    const found = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(found);
    localStorage.setItem('nyayasetu_current_user', JSON.stringify(found));
  };

  const loginAs = (userId) => {
    const found = DEMO_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('nyayasetu_current_user', JSON.stringify(found));
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole, loginAs, demoUsers: DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
