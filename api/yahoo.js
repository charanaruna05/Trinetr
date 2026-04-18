// ============================================================
// FILE: api/yahoo.js  (root में — src के बाहर)
// PURPOSE: Yahoo Finance proxy — CORS problem solve
// Vercel इसे automatically serverless function बनाता है
// ============================================================

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin",  "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  const { symbol, type } = req.query

  if (!symbol) {
    return res.status(400).json({ error: "symbol required" })
  }

  try {
    let url = ""

    if (type === "search") {
      url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(symbol)}&newsCount=0`
    } else {
      url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept":     "application/json",
      },
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: "Yahoo API failed" })
    }

    const data = await response.json()
    return res.status(200).json(data)

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
