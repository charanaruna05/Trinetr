import { useState } from "react";

// ═══════════════════════════════════════════════
// 📁 data/watchlistData.js — DATA यहाँ बदलो
// ═══════════════════════════════════════════════
const scannerMap = {
  Brahmastra: "BMS",
  Trishul: "TS",
  Sudarshan: "SS",
  "All-in-One": "AiO",
  Index: "IND",
  Scalp: "SCP",
};

const rawScanners = ["Brahmastra", "Trishul", "Sudarshan", "All-in-One", "Index", "Scalp"];
const stockNames  = ["RELIANCE", "TCS", "HDFC BANK", "INFY", "SBI", "ITC", "WIPRO"];

// ✅ यहाँ असली stocks add करो — अभी dummy data है
const stocks = Array.from({ length: 30 }, (_, idx) => {
  const i = idx + 1;
  const scannerFull = rawScanners[i % rawScanners.length];
  return {
    sr:       i,
    name:     stockNames[i % stockNames.length],
    price:    (2450.50 + i * 10).toFixed(2),
    sector:   "IT",
    scanner:  scannerFull,
    scanShort: scannerMap[scannerFull],
    isBuy:    i % 2 === 0,
    score:    95 - i,
    // Stock detail popup data
    entry:    (2440 + i).toString(),
    target1:  (2480 + i).toString(),
    target2:  (2520 + i).toString(),
    sl:       (2420 + i).toString(),
    tsl:      (2435 + i).toString(),
    exit:     "---",
  };
});

// ═══════════════════════════════════════════════
// 📁 components/Popup.jsx — Slide-down popup
// ═══════════════════════════════════════════════
function Popup({ open, title, children, onClose }) {
  return (
    <div style={{
      position: "fixed", top: open ? 0 : "-55%",
      left: 0, width: "100%", height: "45%",
      background: "#0d0d0d",
      borderBottom: "3.5px solid #FFD700",
      transition: "top 0.4s ease",
      zIndex: 2000, padding: 15,
      overflow: "hidden",
    }}>
      <span
        onClick={onClose}
        style={{ float: "right", color: "#FF3131", fontWeight: "bold", cursor: "pointer", padding: 5, fontSize: 13 }}
      >
        बंद करें ✖
      </span>
      <h3 style={{ color: "#FFD700", fontSize: 18, marginTop: 0 }}>{title}</h3>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3,1fr)",
        gap: 10, marginTop: 10,
      }}>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// 📁 components/DataCard.jsx — popup के अंदर cards
// ═══════════════════════════════════════════════
function DataCard({ label, value, color, span3 }) {
  return (
    <div style={{
      background: "#1a1a1a", padding: 8,
      border: "1px solid #FFD700",
      textAlign: span3 ? "left" : "center",
      fontSize: 11,
      gridColumn: span3 ? "span 3" : undefined,
    }}>
      {span3 ? (
        <div dangerouslySetInnerHTML={{ __html: value }} />
      ) : (
        <>
          {label}
          <span style={{ display: "block", fontWeight: "bold", fontSize: 14, marginTop: 4, color: color || "#fff" }}>
            {value}
          </span>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// 📁 components/BottomNav.jsx
// ═══════════════════════════════════════════════
const navTabs = [
  { id: "home",      icon: "fa-home",           label: "HOME",   href: "home.html" },
  { id: "signal",    icon: "fa-satellite-dish",  label: "SIGNAL", href: "signal.html" },
  { id: "chart",     icon: "fa-chart-bar",        label: "CHART",  href: "chart.html" },
  { id: "watchlist", icon: "fa-list-ul",          label: "LIST",   href: "#" },
  { id: "admin",     icon: "fa-cog",              label: "ADMIN",  href: "control.html" },
];

function BottomNav() {
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, width: "100%", height: 70,
      background: "#000", display: "grid",
      gridTemplateColumns: "repeat(5,1fr)",
      borderTop: "1px solid #1f1f1f", zIndex: 1000,
    }}>
      {navTabs.map(t => (
        <a key={t.id} href={t.href} style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          color: t.id === "watchlist" ? "#FFD700" : "#666",
          textDecoration: "none", fontSize: 10,
        }}>
          <i className={`fas ${t.icon}`} style={{ fontSize: 20, marginBottom: 4 }} />
          {t.label}
        </a>
      ))}
    </nav>
  );
}

// ═══════════════════════════════════════════════
// 📁 components/StockTable.jsx — मुख्य table
// ═══════════════════════════════════════════════
function StockTable({ onStockClick, onSectorClick, onScannerClick }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, tableLayout: "fixed" }}>
      <thead>
        <tr>
          {[
            { label: "SR",   w: 30 },
            { label: "STOCK",w: 85 },
            { label: "PRICE",w: 70 },
            { label: "SEC",  w: 50 },
            { label: "SCAN", w: 50 },
            { label: "SIG",  w: 55 },
            { label: "SCR",  w: 40 },
          ].map(col => (
            <th key={col.label} style={{
              width: col.w, background: "#1a1a1a", color: "#FFD700",
              padding: "10px 2px", border: "1px solid #1f1f1f",
              position: "sticky", top: 0, zIndex: 5, fontWeight: 800,
            }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {stocks.map(s => (
          <tr key={s.sr}>
            <td style={td}>{s.sr}</td>
            <td style={{ ...td, color: "#FFD700", fontWeight: "bold", cursor: "pointer" }}
              onClick={() => onStockClick(s)}>{s.name}</td>
            <td style={td}>{s.price}</td>
            <td style={{ ...td, cursor: "pointer" }}
              onClick={() => onSectorClick(s.sector)}>{s.sector}</td>
            <td style={{ ...td, cursor: "pointer" }}
              onClick={() => onScannerClick(s.scanner)}>{s.scanShort}</td>
            <td style={{ ...td, color: s.isBuy ? "#00FF00" : "#FF3131", fontWeight: "bold" }}>
              {s.isBuy ? "BUY" : "SELL"}
            </td>
            <td style={td}>{s.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const td = {
  padding: "12px 2px",
  border: "1px solid #1f1f1f",
  textAlign: "center",
  color: "#fff",
};

// ═══════════════════════════════════════════════
// 📁 pages/Watchlist.jsx — Main page
// ═══════════════════════════════════════════════
export default function Watchlist() {
  const [popup, setPopup] = useState({ open: false, title: "", content: null });

  function openStock(s) {
    setPopup({
      open: true,
      title: s.name,
      content: (
        <>
          <DataCard label="Entry"    value={s.entry} />
          <DataCard label="Target 1" value={s.target1} color="#00FF00" />
          <DataCard label="Target 2" value={s.target2} color="#00FF00" />
          <DataCard label="SL"       value={s.sl}     color="#FF3131" />
          <DataCard label="TSL"      value={s.tsl} />
          <DataCard label="Exit"     value={s.exit} />
        </>
      ),
    });
  }

  function openSector(sec) {
    setPopup({
      open: true,
      title: sec + " Info",
      content: (
        <DataCard span3 value={`<p>🟢 BUY Stocks: 5</p><p>🔴 SELL Stocks: 2</p><p>Sector Trend: Bullish</p>`} />
      ),
    });
  }

  function openScanner(scan) {
    setPopup({
      open: true,
      title: scan + " Logic",
      content: (
        <DataCard span3 value={`<p>• Logic: ${scan} Parameter Trigger</p><p>• EMA/RSI Crossover Observed</p>`} />
      ),
    });
  }

  function closePopup() {
    setPopup(p => ({ ...p, open: false }));
  }

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      <div style={{
        background: "#000", color: "#fff", height: "100vh",
        display: "flex", flexDirection: "column",
        fontFamily: "sans-serif", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: "#111", color: "#FFD700", textAlign: "center",
          padding: "12px 0", fontSize: 16, fontWeight: 800,
          letterSpacing: "1.5px", borderBottom: "1px solid #FFD700",
          flexShrink: 0,
        }}>
          🔱 TRINETR WATCHLIST
        </div>

        {/* Table scroll area */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
          <StockTable
            onStockClick={openStock}
            onSectorClick={openSector}
            onScannerClick={openScanner}
          />
        </div>

        {/* Slide Popup */}
        <Popup open={popup.open} title={popup.title} onClose={closePopup}>
          {popup.content}
        </Popup>

        {/* Bottom Nav */}
        <BottomNav />
      </div>
    </>
  );
      }
            
