// ============================================================
// FILE: src/brokers/dhan.js
// PURPOSE: Dhan broker — सिर्फ यह file छूना इसमें problem हो तो
// ============================================================

const DHAN_CONFIG = {
  name:    'Dhan',
  baseURL: 'https://api.dhan.co',
};

let _accessToken = null;
let _clientId    = null;

// ──────────────────────────────────────────────
// 1. INIT — Dhan में OAuth नहीं, token directly set होता है
//    Dhan portal से access_token copy करो और यहाँ set करो
// ──────────────────────────────────────────────
export function dInit(clientId, accessToken) {
  _clientId    = clientId;
  _accessToken = accessToken;
  return { success: true };
}

// ──────────────────────────────────────────────
// 2. QUOTE — live LTP
//    securityId = Dhan का security ID (e.g. '1333' for HDFC Bank)
//    exchangeSegment = 'NSE_EQ' | 'BSE_EQ' | 'NSE_FNO'
// ──────────────────────────────────────────────
export async function dGetQuote(securityId, exchangeSegment = 'NSE_EQ') {
  const res  = await _get(`/v2/marketfeed/ltp`, {
    securities: { [exchangeSegment]: [securityId] },
  });
  const seg  = res?.data?.[exchangeSegment];
  if (!seg) throw new Error('Quote not found');
  const item = Object.values(seg)[0];
  return {
    securityId,
    ltp:    item.last_price,
    change: item.net_change,
    pct:    item.percentage_change,
  };
}

// ──────────────────────────────────────────────
// 3. PLACE ORDER
// ──────────────────────────────────────────────
export async function dPlaceOrder({
  securityId, exchangeSegment, qty, price,
  orderType = 'LIMIT', transactionType, productType = 'INTRADAY',
}) {
  const body = {
    dhanClientId:      _clientId,
    transactionType,          // 'BUY' | 'SELL'
    exchangeSegment,          // 'NSE_EQ' etc
    productType,              // 'INTRADAY' | 'CNC'
    orderType,                // 'LIMIT' | 'MARKET' | 'SL'
    validity:          'DAY',
    tradingSymbol:     '',
    securityId,
    quantity:          qty,
    price,
    disclosedQuantity: 0,
    afterMarketOrder:  false,
  };
  const res = await _post('/v2/orders', body);
  if (res.status === 'failure') throw new Error(res.remarks || 'Order failed');
  return { orderId: res.orderId };
}

// ──────────────────────────────────────────────
// 4. ORDER LIST
// ──────────────────────────────────────────────
export async function dGetOrders() {
  return _get('/v2/orders');
}

// ──────────────────────────────────────────────
// 5. POSITIONS
// ──────────────────────────────────────────────
export async function dGetPositions() {
  const data = await _get('/v2/positions');
  if (!Array.isArray(data)) return [];
  return data.map(p => ({
    symbol:   p.tradingSymbol,
    qty:      p.netQty,
    avgPrice: p.costPrice,
    pnl:      p.unrealizedProfit,
  }));
}

// ──────────────────────────────────────────────
// 6. HOLDINGS
// ──────────────────────────────────────────────
export async function dGetHoldings() {
  return _get('/v2/holdings');
}

// ──────────────────────────────────────────────
// INTERNAL HELPERS
// ──────────────────────────────────────────────
function _headers() {
  return {
    'Content-Type':  'application/json',
    'access-token':  _accessToken,
    'client-id':     _clientId,
  };
}

async function _get(path) {
  const res  = await fetch(`${DHAN_CONFIG.baseURL}${path}`, {
    method:  'GET',
    headers: _headers(),
  });
  if (!res.ok) throw new Error(`Dhan API error: ${res.status}`);
  return res.json();
}

async function _post(path, body) {
  const res  = await fetch(`${DHAN_CONFIG.baseURL}${path}`, {
    method:  'POST',
    headers: _headers(),
    body:    JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Dhan API error: ${res.status}`);
  return res.json();
}

export const DhanBroker = {
  name:         DHAN_CONFIG.name,
  init:         dInit,
  getQuote:     dGetQuote,
  placeOrder:   dPlaceOrder,
  getOrders:    dGetOrders,
  getPositions: dGetPositions,
  getHoldings:  dGetHoldings,
};
