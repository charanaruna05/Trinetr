// ============================================================
// FILE: src/brokers/zerodha.js
// PURPOSE: Zerodha (KiteConnect) — सिर्फ यह file छूना इसमें problem हो तो
// ============================================================

const ZERODHA_CONFIG = {
  name:    'Zerodha',
  baseURL: 'https://api.kite.trade',
};

let _apiKey      = null;
let _accessToken = null;

// ──────────────────────────────────────────────
// 1. STEP 1 — Login URL generate करो (browser में खोलो)
//    User login करेगा → redirect URL में request_token मिलेगा
// ──────────────────────────────────────────────
export function zGetLoginURL(apiKey) {
  _apiKey = apiKey;
  return `https://kite.zerodha.com/connect/login?api_key=${apiKey}&v=3`;
}

// ──────────────────────────────────────────────
// 2. STEP 2 — request_token से access_token लो
//    apiSecret = Kite Console से मिलता है
// ──────────────────────────────────────────────
export async function zGenerateSession(apiKey, apiSecret, requestToken) {
  _apiKey = apiKey;

  // checksum = sha256(api_key + request_token + api_secret)
  const checksum = await sha256(`${apiKey}${requestToken}${apiSecret}`);

  const body = new URLSearchParams({
    api_key:       apiKey,
    request_token: requestToken,
    checksum,
  });

  const res  = await fetch(`${ZERODHA_CONFIG.baseURL}/session/token`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Kite-Version':'3',
    },
    body,
  });
  const data = await res.json();

  if (data.status !== 'success') throw new Error(data.message || 'Session failed');
  _accessToken = data.data.access_token;
  return { success: true, accessToken: _accessToken };
}

// ──────────────────────────────────────────────
// 3. INIT — अगर पहले से access_token है तो directly set करो
// ──────────────────────────────────────────────
export function zInit(apiKey, accessToken) {
  _apiKey      = apiKey;
  _accessToken = accessToken;
}

// ──────────────────────────────────────────────
// 4. QUOTE
//    instruments = ['NSE:RELIANCE', 'NSE:TCS']
// ──────────────────────────────────────────────
export async function zGetQuote(instruments) {
  const params = instruments.map(i => `i=${encodeURIComponent(i)}`).join('&');
  const data   = await _get(`/quote?${params}`);
  return data.data;
}

// ──────────────────────────────────────────────
// 5. LTP only (faster)
// ──────────────────────────────────────────────
export async function zGetLTP(instruments) {
  const params = instruments.map(i => `i=${encodeURIComponent(i)}`).join('&');
  const data   = await _get(`/quote/ltp?${params}`);
  return data.data;
}

// ──────────────────────────────────────────────
// 6. PLACE ORDER
// ──────────────────────────────────────────────
export async function zPlaceOrder({
  exchange, tradingsymbol, qty, price,
  orderType = 'LIMIT', transactionType, product = 'MIS',
}) {
  const body = new URLSearchParams({
    exchange,
    tradingsymbol,
    transaction_type: transactionType,   // 'BUY' | 'SELL'
    quantity:         String(qty),
    price:            String(price),
    product,                             // 'MIS' (intraday) | 'CNC' (delivery)
    order_type:       orderType,         // 'LIMIT' | 'MARKET' | 'SL'
    validity:         'DAY',
  });

  const data = await _post('/orders/regular', body);
  if (data.status !== 'success') throw new Error(data.message);
  return { orderId: data.data.order_id };
}

// ──────────────────────────────────────────────
// 7. ORDERS
// ──────────────────────────────────────────────
export async function zGetOrders() {
  const data = await _get('/orders');
  return data.data || [];
}

// ──────────────────────────────────────────────
// 8. POSITIONS
// ──────────────────────────────────────────────
export async function zGetPositions() {
  const data = await _get('/portfolio/positions');
  return data.data?.net || [];
}

// ──────────────────────────────────────────────
// 9. HOLDINGS
// ──────────────────────────────────────────────
export async function zGetHoldings() {
  const data = await _get('/portfolio/holdings');
  return data.data || [];
}

// ──────────────────────────────────────────────
// INTERNAL HELPERS
// ──────────────────────────────────────────────
function _headers() {
  return {
    'X-Kite-Version': '3',
    'Authorization':  `token ${_apiKey}:${_accessToken}`,
  };
}

async function _get(path) {
  const res = await fetch(`${ZERODHA_CONFIG.baseURL}${path}`, {
    method:  'GET',
    headers: _headers(),
  });
  if (!res.ok) throw new Error(`Zerodha error: ${res.status}`);
  return res.json();
}

async function _post(path, body) {
  const res = await fetch(`${ZERODHA_CONFIG.baseURL}${path}`, {
    method:  'POST',
    headers: { ..._headers(), 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Zerodha error: ${res.status}`);
  return res.json();
}

async function sha256(message) {
  const buf  = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
}

export const ZerodhaBroker = {
  name:            ZERODHA_CONFIG.name,
  getLoginURL:     zGetLoginURL,
  generateSession: zGenerateSession,
  init:            zInit,
  getQuote:        zGetQuote,
  getLTP:          zGetLTP,
  placeOrder:      zPlaceOrder,
  getOrders:       zGetOrders,
  getPositions:    zGetPositions,
  getHoldings:     zGetHoldings,
};
