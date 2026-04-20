// FILE: src/services/apiService.js

const PROXY = "https://query1.finance.yahoo.com/v8/finance/chart"

const INDEX_SYMBOLS = {
  nifty:     "^NSEI",
  sensex:    "^BSESN",
  bankNifty: "^NSEBANK",
  gold:      "GC=F",
  crude:     "CL=F",
}

const TOP_STOCKS = [
  { sym: "RELIANCE.NS",   name: "RELIANCE"   },
  { sym: "HDFCBANK.NS",   name: "HDFCBANK"   },
  { sym: "TCS.NS",        name: "TCS"        },
  { sym: "INFY.NS",       name: "INFY"       },
  { sym: "ICICIBANK.NS",  name: "ICICIBANK"  },
  { sym: "SBIN.NS",       name: "SBIN"       },
  { sym: "AXISBANK.NS",   name: "AXISBANK"   },
  { sym: "BHARTIARTL.NS", name: "BHARTIARTL" },
  { sym: "WIPRO.NS",      name: "WIPRO"      },
  { sym: "TATASTEEL.NS",  name: "TATASTEEL"  },
  { sym: "MARUTI.NS",     name: "MARUTI"     },
  { sym: "SUNPHARMA.NS",  name: "SUNPHARMA"  },
  { sym: "BAJFINANCE.NS", name: "BAJFINANCE" },
  { sym: "KOTAKBANK.NS",  name: "KOTAKBANK"  },
  { sym: "LT.NS",         name: "L&T"        },
  { sym: "ADANIENT.NS",   name: "ADANIENT"   },
  { sym: "HCLTECH.NS",    name: "HCLTECH"    },
  { sym: "ONGC.NS",       name: "ONGC"       },
  { sym: "POWERGRID.NS",  name: "POWERGRID"  },
  { sym: "NTPC.NS",       name: "NTPC"       },
]

const SCANNERS = ["BRAHMASTRA","SUDARSHAN","TRISHUL","ALL-IN-ONE","INDEX"]
function getScanner(i) { return SCANNERS[i % SCANNERS.length] }

function getSignal(change) {
  if (change > 2)    return "STRONG BUY"
  if (change > 0.5)  return "BUY"
  if (change < -2)   return "STRONG SELL"
  if (change < -0.5) return "SELL"
  return "NEUTRAL"
}

function getScore(change) {
  return String(Math.round(Math.min(99, Math.max(50, 75 + change * 3))))
}

async function fetchSymbol(symbol) {
  try {
    const res  = await fetch(`${PROXY}/${encodeURIComponent(symbol)}?interval=1d&range=1d`)
    if (!res.ok) throw new Error(`Failed: ${symbol}`)
    const json = await res.json()
    const meta = json?.chart?.result?.[0]?.meta
    if (!meta) throw new Error(`No data: ${symbol}`)
    return {
      ltp:       meta.regularMarketPrice    || 0,
      prevClose: meta.chartPreviousClose    || meta.previousClose || 0,
      open:      meta.regularMarketOpen     || 0,
      high:      meta.regularMarketDayHigh  || 0,
      low:       meta.regularMarketDayLow   || 0,
      volume:    meta.regularMarketVolume   || 0,
    }
  } catch {
    return { ltp:0, prevClose:0, open:0, high:0, low:0, volume:0 }
  }
}

export async function fetchLivePrices() {
  try {
    const results = await Promise.allSettled(
      Object.entries(INDEX_SYMBOLS).map(async ([key, sym]) => {
        const d      = await fetchSymbol(sym)
        const change = d.prevClose
          ? (((d.ltp - d.prevClose) / d.prevClose) * 100).toFixed(2)
          : "0.00"
        const up = parseFloat(change) >= 0
        return [key, {
          val:    d.ltp > 0 ? d.ltp.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "–",
          change: `${up ? "+" : ""}${change}%`,
          up,
        }]
      })
    )
    const prices = {}
    results.forEach(r => {
      if (r.status === "fulfilled") {
        const [key, val] = r.value
        prices[key] = val
      }
    })
    return {
      nifty:     prices.nifty     || { val: "24,520", change: "+0.42%", up: true  },
      sensex:    prices.sensex    || { val: "81,230", change: "+0.38%", up: true  },
      bankNifty: prices.bankNifty || { val: "52,100", change: "-0.12%", up: false },
      gold:      prices.gold      || { val: "72,450", change: "+0.21%", up: true  },
      crude:     prices.crude     || { val: "6,450",  change: "-0.85%", up: false },
    }
  } catch {
    return dummyPrices()
  }
}

export async function fetchSignals() {
  try {
    const results = await Promise.allSettled(
      TOP_STOCKS.map(s => fetchSymbol(s.sym))
    )
    return TOP_STOCKS.map((stock, i) => {
      const r      = results[i]
      const ok     = r.status === "fulfilled"
      const ltp    = ok ? r.value.ltp       : 0
      const prev   = ok ? r.value.prevClose  : 0
      const change = prev ? ((ltp - prev) / prev) * 100 : 0
      return {
        id:      i + 1,
        name:    stock.name,
        price:   ltp ? ltp.toFixed(2) : "–",
        signal:  getSignal(change),
        score:   getScore(change),
        scanner: getScanner(i),
        trend:   change >= 0 ? "up" : "down",
        change:  `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
      }
    })
  } catch {
    return dummySignals()
  }
}

export async function fetchWatchlist() {
  try {
    const signals = await fetchSignals()
    return signals.map(s => ({
      symbol: s.name,
      ltp:    s.price,
      change: s.change,
      signal: s.signal,
      trend:  s.trend,
    }))
  } catch {
    return getWatchlistDummy()
  }
}

export async function fetchPnL(period) {
  return dummyPnL(period)
}

export async function searchStock(query) {
  try {
    const res  = await fetch(`${PROXY}/${encodeURIComponent(query)}?interval=1d&range=1d`)
    const data = await res.json()
    const meta = data?.chart?.result?.[0]?.meta
    if (!meta) return []
    return [{ symbol: query, name: meta.shortName || query }]
  } catch {
    return []
  }
}

function dummyPrices() {
  return {
    nifty:     { val: "24,520", change: "+0.42%", up: true  },
    sensex:    { val: "81,230", change: "+0.38%", up: true  },
    bankNifty: { val: "52,100", change: "-0.12%", up: false },
    gold:      { val: "72,450", change: "+0.21%", up: true  },
    crude:     { val: "6,450",  change: "-0.85%", up: false },
  }
}

function dummySignals() {
  const sigs = ["STRONG BUY","BUY","BUY","STRONG BUY","SELL","BUY","SELL","BUY","SELL","BUY"]
  return TOP_STOCKS.slice(0, 10).map((s, i) => ({
    id:      i + 1,
    name:    s.name,
    price:   "–",
    signal:  sigs[i],
    score:   String(95 - i * 5),
    scanner: getScanner(i),
    trend:   sigs[i].includes("BUY") ? "up" : "down",
    change:  "–",
  }))
}

function getWatchlistDummy() {
  return TOP_STOCKS.slice(0, 10).map((s, i) => ({
    symbol: s.name,
    ltp:    "–",
    change: "–",
    signal: i % 2 === 0 ? "BUY" : "SELL",
    trend:  i % 2 === 0 ? "up"  : "down",
  }))
}

function dummyPnL(period) {
  const d = {
    "1DAY":   { pnl: "+₹12,450",   trades: 14,  accuracy: "78%" },
    "1WEEK":  { pnl: "+₹58,200",   trades: 62,  accuracy: "74%" },
    "1MONTH": { pnl: "+₹2,10,500", trades: 240, accuracy: "71%" },
  }
  return d[period] || d["1DAY"]
}
