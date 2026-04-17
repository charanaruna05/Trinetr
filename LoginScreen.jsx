// ============================================================
// FILE: src/auth/LoginScreen.jsx
// PURPOSE: Login page UI — यहाँ सिर्फ design बदलें
// ============================================================

import { useState } from 'react';

export default function LoginScreen({ onLogin, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);

  function handleSubmit() {
    if (!username || !password) return;
    onLogin(username, password);
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>🔱</div>
        <h1 style={styles.title}>TRINETR PRO</h1>
        <p style={styles.sub}>Stock Intelligence Platform</p>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Username */}
        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoComplete="username"
        />

        {/* Password */}
        <div style={styles.passWrap}>
          <input
            style={{ ...styles.input, marginBottom: 0, flex: 1 }}
            placeholder="Password"
            type={show ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoComplete="current-password"
          />
          <button style={styles.eye} onClick={() => setShow(s => !s)}>
            {show ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Login Button */}
        <button style={styles.btn} onClick={handleSubmit}>
          🔐 LOGIN
        </button>

        <p style={styles.footer}>TRISHUL © 2025 — Secure Access</p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    height: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#000',
  },
  card: {
    background: '#0c0c0c', border: '1px solid #ff9800',
    padding: '2rem', width: '100%', maxWidth: 360,
    display: 'flex', flexDirection: 'column', gap: '1rem',
    alignItems: 'center',
  },
  logo:  { fontSize: '3rem' },
  title: { color: '#ff9800', fontSize: '1.5rem', letterSpacing: 4 },
  sub:   { color: '#666', fontSize: '0.8rem' },
  error: {
    background: '#1a0000', border: '1px solid #ff3d00',
    color: '#ff3d00', padding: '0.5rem 1rem',
    width: '100%', textAlign: 'center', fontSize: '0.85rem',
  },
  input: {
    width: '100%', background: '#111', border: '1px solid #333',
    color: '#fff', padding: '0.7rem 1rem', fontSize: '1rem',
    outline: 'none', marginBottom: 0,
  },
  passWrap: {
    display: 'flex', gap: '0.5rem',
    width: '100%', alignItems: 'center',
  },
  eye: {
    background: '#111', border: '1px solid #333',
    color: '#fff', padding: '0.7rem', cursor: 'pointer', fontSize: '1rem',
  },
  btn: {
    width: '100%', background: '#ff9800', color: '#000',
    border: 'none', padding: '0.8rem', fontSize: '1rem',
    fontWeight: 'bold', cursor: 'pointer', letterSpacing: 2,
  },
  footer: { color: '#333', fontSize: '0.7rem' },
};
