// ============================================================
// FILE: src/components/BrokerConnect.jsx
// PURPOSE: Broker connect करने का UI — अलग file, अलग काम
// ============================================================

import { useState } from 'react';
import { BROKER_LIST, selectBroker, getBroker } from '../brokers/index.js';

export default function BrokerConnect({ onConnected }) {
  const [selected, setSelected]   = useState('shoonya');
  const [status,   setStatus]     = useState('');
  const [loading,  setLoading]    = useState(false);
  const [creds,    setCreds]      = useState({});

  // Broker-specific credential fields
  const FIELDS = {
    shoonya: [
      { key: 'userid',      label: 'User ID',      type: 'text'     },
      { key: 'password',    label: 'Password',     type: 'password' },
      { key: 'twoFA',       label: 'TOTP / 2FA',   type: 'text'     },
      { key: 'vendor_code', label: 'Vendor Code',  type: 'text'     },
      { key: 'api_secret',  label: 'API Secret',   type: 'password' },
    ],
    dhan: [
      { key: 'clientId',     label: 'Client ID',    type: 'text'     },
      { key: 'accessToken',  label: 'Access Token', type: 'password' },
    ],
    zerodha: [
      { key: 'apiKey',       label: 'API Key',      type: 'text'     },
      { key: 'accessToken',  label: 'Access Token', type: 'password' },
    ],
    upstox: [
      { key: 'apiKey',       label: 'API Key',      type: 'text'     },
      { key: 'accessToken',  label: 'Access Token', type: 'password' },
    ],
  };

  async function handleConnect() {
    setLoading(true);
    setStatus('');
    try {
      const broker = selectBroker(selected);

      if (selected === 'shoonya') {
        const res = await broker.login(creds);
        if (!res.success) throw new Error(res.error);

      } else if (selected === 'dhan') {
        broker.init(creds.clientId, creds.accessToken);

      } else if (selected === 'zerodha') {
        broker.init(creds.apiKey, creds.accessToken);

      } else if (selected === 'upstox') {
        broker.init(creds.apiKey, creds.accessToken);
      }

      setStatus(`✅ ${broker.name} connected!`);
      setTimeout(() => onConnected?.(broker), 800);

    } catch (err) {
      setStatus(`❌ ${err.message}`);
    }
    setLoading(false);
  }

  const fields = FIELDS[selected] || [];

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>🔌 Broker Connect</h2>

      {/* Broker Selector */}
      <div style={styles.tabs}>
        {BROKER_LIST.map(b => (
          <button
            key={b.key}
            style={{ ...styles.tab, ...(selected === b.key ? styles.tabActive : {}) }}
            onClick={() => { setSelected(b.key); setCreds({}); setStatus(''); }}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* Credential Fields */}
      <div style={styles.form}>
        {fields.map(f => (
          <div key={f.key} style={styles.field}>
            <label style={styles.label}>{f.label}</label>
            <input
              style={styles.input}
              type={f.type}
              placeholder={f.label}
              value={creds[f.key] || ''}
              onChange={e => setCreds(prev => ({ ...prev, [f.key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      {/* Status */}
      {status && (
        <div style={{
          ...styles.status,
          color: status.startsWith('✅') ? '#00c853' : '#ff3d00',
        }}>
          {status}
        </div>
      )}

      {/* Connect Button */}
      <button
        style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
        onClick={handleConnect}
        disabled={loading}
      >
        {loading ? '⏳ Connecting...' : '🔗 CONNECT'}
      </button>
    </div>
  );
}

const styles = {
  wrap:  { padding: '1rem', maxWidth: 420, margin: '0 auto' },
  title: { color: '#ff9800', marginBottom: '1rem', textAlign: 'center' },
  tabs:  { display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' },
  tab:   {
    flex: 1, padding: '0.5rem', background: '#111',
    border: '1px solid #333', color: '#666', cursor: 'pointer', fontSize: '0.85rem',
  },
  tabActive: { border: '1px solid #ff9800', color: '#ff9800' },
  form:  { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  label: { color: '#888', fontSize: '0.75rem' },
  input: {
    background: '#111', border: '1px solid #333', color: '#fff',
    padding: '0.6rem 0.8rem', fontSize: '0.9rem', outline: 'none',
  },
  status: { textAlign: 'center', padding: '0.5rem', fontSize: '0.9rem' },
  btn: {
    marginTop: '1rem', width: '100%', background: '#ff9800', color: '#000',
    border: 'none', padding: '0.8rem', fontSize: '1rem',
    fontWeight: 'bold', cursor: 'pointer',
  },
};
