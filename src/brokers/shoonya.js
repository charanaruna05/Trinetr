// ============================================================
// FILE: src/brokers/shoonya.js
// PURPOSE: Shoonya (Finvasia) — सिर्फ यह file छूना इसमें problem हो तो
// ============================================================

const SHOONYA_CONFIG = {
  name:    'Shoonya',
  baseURL: 'https://api.shoonya.com/NorenWClientTP',
};

let _token  = null;  // session token (login के बाद मिलता है)
let _userId = null;

// ──────────────────────────────────────────────
// 1. LOGIN
//    creds = { userid, password, twoFA, vendor_code, api_secret, imei }
// ──────────────────────────────────────────────
export async function sLogin(creds) {
  const { userid, password, twoFA, vendor_code, api_secret, imei } = creds;

  // TOTP/SHA256 hash बनाना
  const pwdHash  = await sha256(password);
  const appHash  = await sha256(`${userid}|${api_secret}`);

  const body = `jData=${JSON.stringify({
    apkversion: '1.0.0',
    uid:        userid,
    pwd:        pwdHash,
    factor2:    twoFA,
    vc:         vendor_code,
    appkey:     appHash,
    imei:       imei || 'api',
    source:     'API',
  })}&jKey=`;

  const res  = await fetch(`${SHOONYA_CONFIG.baseURL}/QuickAuth`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await res.json();

  if (data.stat === 'Ok') {
    _token  = data.susertoken;
    _userId = userid;
    return { success: true, token: _token };
  }
  return { success: false, error: data.emsg || 'Login failed' };
}

// ──────────────────────────────────────────────
// 2. LOGOUT
// ──────────────────────────────────────────────
export async function sLogout() {
  if (!_token) return;
  await _post('Logout', { uid: _userId });
  _token  = null;
  _userId = null;
}

// ──────────────────────────────────────────────
// 3. QUOTE — एक stock का live price
//    exchange = 'NSE' | 'BSE' | 'MCX'
//    symbol   = e.g. 'RELIANCE-EQ'
// ──────────────────────────────────────────────
export async function sGetQuote(exchange, symbol) {
  const data = await _post('GetQuotes', { exch: exchange, token: symbol });
  if (data.stat !== 'Ok') throw new Error(data.emsg);
  return {
    symbol: data.tsym,
    ltp:    parseFloat(data.lp  || 0),
    open:   parseFloat(data.o   || 0),
    high:   parseFloat(data.h   || 0),
    low:    parseFloat(data.l   || 0),
    close:  parseFloat(data.c   || 0),
    volume: parseInt  (data.v   || 0),
    change: parseFloat(data.pc  || 0),
  };
}

// ──────────────────────────────────────────────
// 4. ORDER PLACE
// ──────────────────────────────────────────────
export async function sPlaceOrder({ exchange, symbol, qty, price, type, side }) {
  const data = await _post('PlaceOrder', {
    uid:      _userId,
    actid:    _userId,
    exch:     exchange,
    tsym:     symbol,
    qty:      String(qty),
    prc:      String(price),
    prd:      'I',               // Intraday
    trantype: side === 'BUY' ? 'B' : 'S',
    prctyp:   type || 'LMT',     // LMT | MKT | SL-LMT
    ret:      'DAY',
  });
  if (data.stat !== 'Ok') throw new Error(data.emsg);
  return { orderId: data.norenordno };
}

// ──────────────────────────────────────────────
// 5. ORDER STATUS
// ──────────────────────────────────────────────
export async function sGetOrderStatus(orderId) {
  const data = await _post('SingleOrdHist', {
    uid:        _userId,
    norenordno: orderId,
  });
  if (data.stat !== 'Ok') throw new Error(data.emsg);
  return data;
}

// ──────────────────────────────────────────────
// 6. POSITIONS
// ──────────────────────────────────────────────
export async function sGetPositions() {
  const data = await _post('PositionBook', { uid: _userId, actid: _userId });
  if (!Array.isArray(data)) return [];
  return data.map(p => ({
    symbol:  p.tsym,
    qty:     parseInt(p.netqty || 0),
    avgPrice:parseFloat(p.netavgprc || 0),
    pnl:     parseFloat(p.rpnl || 0),
  }));
}

// ──────────────────────────────────────────────
// INTERNAL HELPERS — इन्हें मत छुओ
// ──────────────────────────────────────────────
async function _post(endpoint, payload) {
  const body = `jData=${JSON.stringify(payload)}&jKey=${_token}`;
  const res  = await fetch(`${SHOONYA_CONFIG.baseURL}/${endpoint}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  return res.json();
}

async function sha256(message) {
  const msgBuffer  = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray  = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const ShoonyaBroker = {
  name:          SHOONYA_CONFIG.name,
  login:         sLogin,
  logout:        sLogout,
  getQuote:      sGetQuote,
  placeOrder:    sPlaceOrder,
  getOrderStatus:sGetOrderStatus,
  getPositions:  sGetPositions,
};
