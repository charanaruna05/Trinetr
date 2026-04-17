// ============================================================
// FILE: src/brokers/index.js
// PURPOSE: Universal Broker Connector — एक जगह से सब control
//          नया broker add करना हो? सिर्फ यहाँ import करो
// ============================================================

import { ShoonyaBroker } from './shoonya.js';
import { DhanBroker }    from './dhan.js';
import { ZerodhaBroker } from './zerodha.js';
import { UpstoxBroker }  from './upstox.js';

// ✅ सभी brokers एक जगह
export const BROKERS = {
  shoonya: ShoonyaBroker,
  dhan:    DhanBroker,
  zerodha: ZerodhaBroker,
  upstox:  UpstoxBroker,
};

// Active broker (default: शुरू में कोई नहीं)
let _activeBroker = null;
let _brokerKey    = null;

// ──────────────────────────────────────────────
// Broker select करो
// key = 'shoonya' | 'dhan' | 'zerodha' | 'upstox'
// ──────────────────────────────────────────────
export function selectBroker(key) {
  if (!BROKERS[key]) throw new Error(`Unknown broker: ${key}`);
  _activeBroker = BROKERS[key];
  _brokerKey    = key;
  console.log(`✅ Broker set: ${_activeBroker.name}`);
  return _activeBroker;
}

// Active broker name
export function getActiveBrokerName() {
  return _activeBroker?.name || 'None';
}

// Active broker key
export function getActiveBrokerKey() {
  return _brokerKey;
}

// Active broker object (सभी functions के साथ)
export function getBroker() {
  if (!_activeBroker) throw new Error('❌ कोई broker select नहीं किया');
  return _activeBroker;
}

// Broker list (UI dropdown के लिए)
export const BROKER_LIST = Object.entries(BROKERS).map(([key, b]) => ({
  key,
  name: b.name,
}));
