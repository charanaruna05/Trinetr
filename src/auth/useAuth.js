// ============================================================
// FILE: src/auth/useAuth.js
// PURPOSE: Master Access Control — सिर्फ यहां बदलाव करें
// ============================================================

import { useState, useEffect } from 'react';

// ✅ यहाँ users add/remove करें — बाकी कुछ नहीं छूना
const USERS = [
  { username: 'Arunacharan007', password: '@Puran007', role: 'master' }, // आपका नया लॉगिन
  { username: 'user1',          password: 'user1@123',   role: 'viewer' }, 
];

// ✅ Role permissions — master के पास सब, viewer के पास सिर्फ देखना
const PERMISSIONS = {
  master: {
    canTrade:       true,
    canSeeSignals:  true,
    canChangeBroker:true,
    canManageUsers: true,
  },
  viewer: {
    canTrade:       false,
    canSeeSignals:  true,
    canChangeBroker:false,
    canManageUsers: false,
  },
};

const SESSION_KEY = 'trinetr_session';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError]             = useState('');

  // App खुलते ही session check करें
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  // Login function
  function login(username, password) {
    setError('');
    const found = USERS.find(
      u => u.username === username.trim() && u.password === password
    );
    if (!found) {
      setError('❌ गलत username या password');
      return false;
    }
    const session = {
      username: found.username,
      role:     found.role,
      perms:    PERMISSIONS[found.role],
      loginAt:  new Date().toISOString(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setCurrentUser(session);
    return true;
  }

  // Logout function
  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  }

  return { currentUser, login, logout, error };
}
