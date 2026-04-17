// ============================================================
// FILE: src/brokers/upstox.js
// PURPOSE: Upstox v2 — सिर्फ यह file छूना इसमें problem हो तो
// ============================================================

const UPSTOX_CONFIG = {
  name:    'Upstox',
  baseURL: 'https://api.upstox.com/v2',
};

let _apiKey      = null;
let _apiSecret   = null;
let _accessToken = null;
let _redirectUri = null;

// ──────────────────────────────────────────────
// 1. STEP 1 — Login URL generate करो
// ──────────────────────────────────────────────
export function uGetLoginURL(apiKey, redirectUri) {
  _apiKey      = apiKey;
  _redirectUri = redirectUri;
  return (
    `https://api.upstox.com/v2/login/authorization/dialog` +
    `?response_type=code` +
    `&client_id=${apiKey}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`
  );
}

// ──────────────────────────────────────────────
// 2. STEP 2 — code से access_token लो
// ──────────────────────────────────────────────
export async function uGenerateToken(apiKey, apiSecret, redirectUri, code) {
  _apiKey    = apiKey;
  _apiSecret = apiSecret;

  const body = new URLSearchParams({
    code,
    client_id:     apiKey,
    client_secret: apiSecret,
    redirect_uri:  redirectUri,
    grant_type:    'authorization_code',
  });

  const res  = await fetch(`${UPSTOX_CONFIG.baseURL}/login/authorization/token`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
    body,
  });
  const data = await res.json();

  if (!data.access_token) throw new Error(data.message || 'Token generation failed');
  _accessToken = data.access_token;
  return { success: true, accessToken: _accessToken };
}

// ──────────────────────────────────────────────
// 3. INIT — पहले से token है तो set करो
// ──────────────────────────────────────────────
export function uInit(apiKey, accessToken) {
  _apiKey      = apiKey;
  _accessToken = accessToken;
}

// ──────────────────────────────────────────────
// 4. PROFILE
// ──────────────────────────────────────────────
export async function uGetProfile() {
  return _get('/user/profile');
}

// ──────────────────────────────────────────────
// 5. QUOTE
//    instrumentKey = 'NSE_EQ|INE040A01034' (HDFC Bank example)
// ──────────────────────────────────────────────
export async function uGetQuote(instrumentKeys) {
  const params = instrumentKeys.map(k => `instrument_key=${encodeURIComponent(k)}`).join('&');
  return _get(`/market-quote/quotes?${params}`);
}

// ──────────────────────────────────────────────
// 6. LTP only
// ──────────────────────────────────────────────
export async function uGetLTP(instrumentKeys) {
  const params = instrumentKeys.map(k => `instrument_key=${encodeURIComponent(k)}`).join('&');
  return _get(`/market-quote/ltp?${params}`);
}

// ──────────────────────────────────────────────
// 7. PLACE ORDER
// ──────────────────────────────────────────────
export async function uPlaceOrder({
  instrumentToken, qty, price,
  orderType = 'LIMIT', transactionType, product = 'I',
}) {
  const body = {
    quantity:         qty,
    product,                    // 'I' = Intraday, 'D' = Delivery
    validity:         'DAY',
    price,
    tag:              'TRINETR',
    instrument_token: instrumentToken,
    order_type:       orderType,      // 'LIMIT' | 'MARKET' | 'SL' | 'SL-M'
    transaction_type: transactionType,// 'BUY' | 'SELL'
    disclosed_quantity: 0,
    trigger_price:    0,
    is_amo:           false,
  };

  const data = await _post('/order/place', body);
  if (data.status !== 'success') throw new Error(data.errors?.[0]?.message || 'Order failed');
  return { orderId: data.data.order_id };
}

// ──────────────────────────────────────────────
// 8. ORDER BOOK
// ──────────────────────────────────────────────
export async function uGetOrders() {
  const data = await _get('/order/retrieve-all');
  return data.data || [];
}

// ──────────────────────────────────────────────
// 9. POSITIONS
// ──────────────────────────────────────────────
export async function uGetPositions() {
  const data = await _get('/portfolio/short-term-positions');
  return data.data || [];
}

// ──────────────────────────────────────────────
// 10. HOLDINGS
// ──────────────────────────────────────────────
export async function uGetHoldings() {
  const data = await _get('/portfolio/long-term-holdings');
  return data.data || [];
}

// ──────────────────────────────────────────────
// INTERNAL HELPERS
// ──────────────────────────────────────────────
function _headers(json = false) {
  const h = {
    'Accept':        'application/json',
    'Authorization': `Bearer ${_accessToken}`,
  };
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

async function _get(path) {
  const res = await fetch(`${UPSTOX_CONFIG.baseURL}${path}`, {
    method: 'GET', headers: _headers(),
  });
  if (!res.ok) throw new Error(`Upstox error: ${res.status}`);
  return res.json();
}

async function _post(path, body) {
  const res = await fetch(`${UPSTOX_CONFIG.baseURL}${path}`, {
    method: 'POST', headers: _headers(true),
    body:   JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Upstox error: ${res.status}`);
  return res.json();
}

export const UpstoxBroker = {
  name:          UPSTOX_CONFIG.name,
  getLoginURL:   uGetLoginURL,
  generateToken: uGenerateToken,
  init:          uInit,
  getProfile:    uGetProfile,
  getQuote:      uGetQuote,
  getLTP:        uGetLTP,
  placeOrder:    uPlaceOrder,
  getOrders:     uGetOrders,
  getPositions:  uGetPositions,
  getHoldings:   uGetHoldings,
};
