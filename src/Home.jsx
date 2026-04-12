import { useState } from "react";

// ═══════════════════════════════════════════════
// 📁 data/homeData.js — HOME page का सारा data
// ═══════════════════════════════════════════════

// ✅ Top stats — यहाँ prices बदलो
const TOP_STATS = [
  { label: "NIFTY 50", val: "23,850" },
  { label: "SENSEX",   val: "78,500" },
  { label: "GOLD",     val: "72,450" },
];

// ✅ News ticker text — यहाँ news बदलो
const NEWS_TEXT =
  "🔱 TRINETR LIVE: NIFTY 23850 ▲ | GOLD 72450 | RELIANCE BULLISH | SECTOR ROTATION ACTIVE 🔱 " +
  "BANK NIFTY 52100 ▲ | CRUDE OIL 6450 ▼ | SENSEX 78500 ▲ | IT SECTOR STRONG 🔱";

// ✅ Entry desk — stocks की entry/target/SL यहाँ बदलो
const ENTRY_CALLS = [
  { symbol: "NIFTY",    ent: "23778", tg1: "24254", tg2: "24967", sl: "23650" },
  { symbol: "RELIANCE", ent: "2377",  tg1: "2425",  tg2: "2496",  sl: "2354"  },
];

// ✅ Sectors list — add/remove/rename यहाँ करो
const SECTORS = [
  "REALTY", "BANKING", "IT", "AUTO", "FINANCE", "CHEMICAL",
  "POWER",  "INFRA",   "TELECOM", "CEMENT", "CONSUMER", "FMCG",
  "ENERGY", "MEDIA",   "PSU BANK", "PHARMA", "OIL&GAS",  "METAL",
];

// ✅ Sector detail data — हर sector की info
const SECTOR_DATA = {
  BANKING:  { buy: 8, sell: 2, trend: "Bullish", stocks: ["HDFC BANK", "ICICI", "SBI", "KOTAK"] },
  IT:       { buy: 5, sell: 3, trend: "Neutral",  stocks: ["TCS", "INFY", "WIPRO", "HCL"] },
  AUTO:     { buy: 6, sell: 1, trend: "Bullish",  stocks: ["MARUTI", "TATA MOTORS", "BAJAJ AUTO"] },
  REALTY:   { buy: 4, sell: 3, trend: "Neutral",  stocks: ["DLF", "GODREJ PROP"] },
  PHARMA:   { buy: 7, sell: 2, trend: "Bullish",  stocks: ["SUNPHARMA", "CIPLA", "DR REDDY"] },
  FMCG:     { buy: 3, sell: 4, trend: "Bearish",  stocks: ["ITC", "HUL", "NESTLE"] },
  // बाकी sectors के लिए default data लगेगा
};

// ═══════════════════════════════════════════════
// 📁 components/NewsTicker.jsx
// ═══════════════════════════════════════════════
function NewsTicker() {
  return (
    <div style={{
      height: 32, background: "#000",
      borderBottom: "1.5px solid #ffff00",
      display: "flex", alignItems: "center",
      flexShrink: 0, overflow: "hidden",
    }}>
      {/* CSS marquee animation */}
      <div style={{ overflow: "hidden", width: "100%" }}>
        <div style={{
          display: "inline-block",
          animation: "marquee 30s linear infinite",
          whiteSpace: "nowrap",
          fontSize: 11, color: "#ffff00", fontWeight: "bold",
        }}>
          {NEWS_TEXT}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{NEWS_TEXT}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════
// 📁 components/TopStats.jsx
// ═══════════════════════════════════════════════
function TopStats({ onProfileClick }) {
  return (
    <div style={{
      height: 65, display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 5, padding: "5px 10px", flexShrink: 0,
    }}>
      {TOP_STATS.map(s => (
        <div key={s.label} style={statBox}>
          <span style={statLabel}>{s.label}</span>
          <span style={statVal}>{s.val}</span>
        </div>
      ))}
      {/* Profile box */}
      <div onClick={onProfileClick} style={{ ...statBox, cursor: "pointer" }}>
        <span style={statLabel}>PROFILE</span>
        <span style={{ fontSize: 14 }}>👤</span>
      </div>
    </div>
  );
}
const statBox   = { background: "#0c1122", border: "1.2px solid #ffff00", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" };
const statLabel = { fontSize: 8, color: "#8a9fd8", fontWeight: "bold" };
const statVal   = { fontSize: 10, fontWeight: "bold", color: "#fff" };

// ═══════════════════════════════════════════════
// 📁 components/EntryDesk.jsx
// ═══════════════════════════════════════════════
function EntryDesk() {
  return (
    <div style={{ height: 90, padding: "0 10px", marginTop: 5, flexShrink: 0 }}>
      <div style={{
        background: "#0a0f1c", border: "1.2px solid #ffff00",
        height: "100%", padding: 5,
        display: "flex", flexDirection: "column", justifyContent: "space-around",
      }}>
        {ENTRY_CALLS.map(c => (
          <div key={c.symbol} style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={{
              border: "1px solid #ffff00", color: "#ffff00",
              fontSize: 8, padding: "3px 2px", minWidth: 60,
              textAlign: "center", fontWeight: "bold",
            }}>
              {c.symbol}
            </div>
            {[
              { label: "ENT",    val: c.ent },
              { label: "TG1",    val: c.tg1 },
              { label: "TG2",    val: c.tg2 },
              { label: "SL TRL", val: c.sl  },
            ].map(chip => (
              <div key={chip.label} style={{
                background: "#0f1428", border: "1px solid #ffff0020",
                flex: 1, textAlign: "center", padding: "2px 0",
              }}>
                <span style={{ fontSize: 6, color: "#8a9fd8", display: "block" }}>{chip.label}</span>
                <span style={{ fontSize: 8, fontWeight: "bold", color: "#ffff00" }}>{chip.val}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// 📁 components/SectorGrid.jsx
// ═══════════════════════════════════════════════
function SectorGrid({ onSectorClick }) {
  return (
    <div style={{ flex: 1, padding: "5px 10px 75px 10px", minHeight: 0 }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(6, 1fr)",
        gap: 4, height: "96%",
      }}>
        {SECTORS.map(name => (
          <div
            key={name}
            onClick={() => onSectorClick(name)}
            style={{
              border: "1.2px solid #ffff00",
              display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "center",
              background: "#0c1122", cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 8, fontWeight: 900, color: "#fff", textTransform: "uppercase" }}>
              {name}
            </span>
            <div style={{ fontSize: 8, fontWeight: "bold", marginTop: 1 }}>
              <span style={{ color: "#2ecc71" }}>▲5</span>{" "}
              <span style={{ color: "#e74c3c" }}>▼2</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// 📁 components/BottomSheet.jsx — slide-up sheet
// ═══════════════════════════════════════════════
function BottomSheet({ open, title, content, onClose }) {
  return (
    <div style={{
      position: "fixed",
      bottom: open ? 0 : "-55%",
      left: 0, width: "100%", height: "50%",
      background: "#0f172a",
      borderTop: "4px solid #ffff00",
      transition: "bottom 0.3s ease",
      zIndex: 2000, padding: 20,
      borderRadius: "20px 20px 0 0",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ color: "#ffff00", fontSize: 16 }}>{title}</h3>
        <button
          onClick={onClose}
          style={{
            background: "#ffff00", border: "none",
            padding: "5px 15px", fontWeight: "bold",
            cursor: "pointer", fontSize: 12,
          }}
        >
          CLOSE
        </button>
      </div>
      <div style={{ marginTop: 20, color: "#ccc", fontSize: 13 }}>
        {content}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// 📁 components/BottomNav.jsx
// ═══════════════════════════════════════════════
const navTabs = [
  { id: "home",  icon: "🏠", label: "HOME",  href: "#"              },
  { id: "dash",  icon: "📊", label: "DASH",  href: "signal.html"    },
  { id: "chart", icon: "📈", label: "CHART", href: "chart.html"     },
  { id: "watch", icon: "⭐", label: "WATCH", href: "watchlist.html" },
];

function BottomNav() {
  return (
    <nav style={{
      height: 70, background: "#000",
      borderTop: "2px solid #ffff00",
      display: "flex", position: "fixed",
      bottom: 0, width: "100%", zIndex: 1000,
    }}>
      {navTabs.map(t => (
        <a key={t.id} href={t.href} style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          color: t.id === "home" ? "#ffff00" : "#555",
          textDecoration: "none",
        }}>
          <span style={{ fontSize: 24, marginBottom: 2 }}>{t.icon}</span>
          <span style={{ fontSize: 9, fontWeight: "bold" }}>{t.label}</span>
        </a>
      ))}
    </nav>
  );
}

// ═══════════════════════════════════════════════
// 📁 pages/Home.jsx — Main Home Page
// ═══════════════════════════════════════════════
export default function Home() {
  const [sheet, setSheet] = useState({ open: false, title: "", content: null });

  function openSector(name) {
    const d = SECTOR_DATA[name] || { buy: 5, sell: 2, trend: "Neutral", stocks: [] };
    setSheet({
      open: true,
      title: name + " SECTOR",
      content: (
        <div>
          <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
            <span>🟢 BUY: <b style={{ color: "#2ecc71" }}>{d.buy}</b></span>
            <span>🔴 SELL: <b style={{ color: "#e74c3c" }}>{d.sell}</b></span>
            <span>📈 Trend: <b style={{ color: "#ffff00" }}>{d.trend}</b></span>
          </div>
          {d.stocks.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: "#8a9fd8", marginBottom: 6 }}>TOP STOCKS:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {d.stocks.map(s => (
                  <span key={s} style={{
                    background: "#1a2340", border: "1px solid #ffff0040",
                    padding: "3px 8px", fontSize: 11, color: "#ffff00",
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    });
  }

  function openProfile() {
    setSheet({
      open: true,
      title: "USER PROFILE",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>👤 <b>ID:</b> CLIENT001</div>
          <div>📞 <b>Phone:</b> +91 98XXX XXXXX</div>
          <div>📧 <b>Email:</b> client@trishul.com</div>
          <div>⭐ <b>Plan:</b> PRO MASTER</div>
        </div>
      ),
    });
  }

  function closeSheet() {
    setSheet(s => ({ ...s, open: false }));
  }

  return (
    <div style={{
      background: "#030712", color: "#fff",
      height: "100vh", width: "100vw",
      overflow: "hidden", display: "flex",
      flexDirection: "column",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* News Ticker */}
      <NewsTicker />

      {/* Logo */}
      <header style={{ height: 45, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <div style={{
          border: "1.5px solid #ffff00", padding: "4px 30px",
          fontSize: 16, fontWeight: 900, color: "#ffff00", letterSpacing: 4,
        }}>
          🔱 TRINETR 🔱
        </div>
      </header>

      {/* Top Stats */}
      <TopStats onProfileClick={openProfile} />

      {/* Entry Desk */}
      <EntryDesk />

      {/* Sector Grid */}
      <SectorGrid onSectorClick={openSector} />

      {/* Bottom Sheet */}
      <BottomSheet
        open={sheet.open}
        title={sheet.title}
        content={sheet.content}
        onClose={closeSheet}
      />

      {/* Overlay */}
      {sheet.open && (
        <div
          onClick={closeSheet}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1999 }}
        />
      )}

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
  }
        
