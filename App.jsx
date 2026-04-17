// ============================================================
// FILE: src/App.jsx
// PURPOSE: Screen routing — Login → BrokerConnect → Dashboard
// ============================================================

import { useState }      from 'react';
import { useAuth }       from './auth/useAuth.js';
import LoginScreen       from './auth/LoginScreen.jsx';
import BrokerConnect     from './components/BrokerConnect.jsx';

export default function App() {
  const { currentUser, login, logout, error } = useAuth();
  const [broker, setBroker] = useState(null);

  // ── 1. Not logged in → Login screen
  if (!currentUser) {
    return <LoginScreen onLogin={login} error={error} />;
  }

  // ── 2. Logged in but no broker → Broker connect screen
  if (!broker) {
    return (
      <div style={{ height: '100vh', overflowY: 'auto', background: '#000' }}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <span style={styles.user}>👤 {currentUser.username} ({currentUser.role})</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
        <BrokerConnect onConnected={b => setBroker(b)} />
      </div>
    );
  }

  // ── 3. Logged in + broker connected → Dashboard (आगे बनेगा)
  return (
    <div style={{ height: '100vh', background: '#000', color: '#fff' }}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <span style={{ color: '#ff9800', fontWeight: 'bold' }}>🔱 TRINETR PRO</span>
        <span style={styles.user}>
          🔌 {broker.name} &nbsp;|&nbsp; 👤 {currentUser.username}
        </span>
        <button style={styles.logoutBtn} onClick={() => setBroker(null)}>
          Change Broker
        </button>
        <button style={{ ...styles.logoutBtn, marginLeft: 4 }} onClick={logout}>
          Logout
        </button>
      </div>

      {/* Placeholder — Dashboard यहाँ आएगा */}
      <div style={styles.center}>
        <div style={{ fontSize: '3rem' }}>🔱</div>
        <div style={{ color: '#ff9800', fontSize: '1.2rem', marginTop: '1rem' }}>
          Dashboard Loading...
        </div>
        <div style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.85rem' }}>
          Broker: {broker.name} &nbsp;|&nbsp; Role: {currentUser.role}
        </div>
      </div>
    </div>
  );
}

const styles = {
  topBar: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.5rem 1rem', background: '#0c0c0c',
    borderBottom: '1px solid #1f1f1f',
  },
  user: { color: '#888', fontSize: '0.8rem', marginLeft: 'auto' },
  logoutBtn: {
    background: 'none', border: '1px solid #333',
    color: '#666', padding: '0.25rem 0.5rem',
    cursor: 'pointer', fontSize: '0.75rem',
  },
  center: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    height: 'calc(100vh - 40px)',
  },
};
