un    scanner: scans[i],
    trend:   sigs[i].includes("BUY") ? "up" : "down",
  }))
}

function dummyPnL(period) {
  const d = {
    "1DAY":   { pnl:"+₹12,450",   trades:14,  accuracy:"78%" },
    "1WEEK":  { pnl:"+₹58,200",   trades:62,  accuracy:"74%" },
    "1MONTH": { pnl:"+₹2,10,500", trades:240, accuracy:"71%" },
  }
  return d[period] || d["1DAY"]
}
