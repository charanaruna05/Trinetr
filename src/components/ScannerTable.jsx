// --- Power Box Final Hybrid Engine ---
// Modes: Average | Intraday | IntradayFixed | Scalp

function powerBoxFinal(stockName, currentPrice, atrValue, pivotLevels, fibLevels, avgVolume, candleVolume, quantityInput, mode, candleLow, candleHigh) {
    
    let entryPrice = currentPrice;
    let quantity = quantityInput;
    let stopLoss, t1, t2, t3, activeSL, tslNote, signalStrength, colorCode, audioAlert;

    // --- Average Mode (ATR + Pivot + Fibonacci + Volume Spike) ---
    if (mode.toLowerCase() === "average") {
        stopLoss = Math.min(entryPrice - atrValue, pivotLevels.support);
        t1 = (entryPrice + (atrValue * 1.2) + fibLevels["38.2"]) / 2;
        t2 = (entryPrice + (atrValue * 1.5) + fibLevels["61.8"]) / 2;
        t3 = (entryPrice + (atrValue * 2) + fibLevels["100"]) / 2;
        activeSL = stopLoss;
        signalStrength = (candleVolume > avgVolume * 2) ? "⚡ STRONG MIX" : "✅ NORMAL MIX";
        tslNote = "AVERAGE MODE ACTIVE";
        colorCode = "GREEN"; 
        audioAlert = "chime";
    }

    // --- Intraday Mode (ATR + Pivot + Fibonacci) ---
    else if (mode.toLowerCase() === "intraday") {
        stopLoss = Math.min(entryPrice - atrValue, pivotLevels.support);
        t1 = Math.max(entryPrice + (atrValue * 1.2), fibLevels["38.2"]);
        t2 = Math.max(entryPrice + (atrValue * 1.5), fibLevels["61.8"]);
        t3 = Math.max(entryPrice + (atrValue * 2), fibLevels["100"]);
        activeSL = stopLoss;
        tslNote = "INTRADAY MODE ACTIVE";
        signalStrength = (candleVolume > avgVolume * 2) ? "⚡ STRONG INTRADAY" : "✅ NORMAL INTRADAY";
        colorCode = "BLUE"; 
        audioAlert = "tick-tak";
    }

    // --- Intraday Fixed Mode (Rigid 1% SL) ---
    else if (mode.toLowerCase() === "intradayfixed") {
        let slDistance = entryPrice * 0.01;
        stopLoss = entryPrice - slDistance;
        t1 = entryPrice + (slDistance * 1.2);
        t2 = entryPrice + (slDistance * 1.5);
        t3 = entryPrice + (slDistance * 2);
        activeSL = stopLoss;
        tslNote = "FIXED MODE ACTIVE";
        signalStrength = "📊 FIXED CALCULATION";
        colorCode = "ORANGE"; 
        audioAlert = "buzz";
    }

    // --- Scalp Mode (Candle-to-Candle Fast Trailing) ---
    else if (mode.toLowerCase() === "scalp") {
        stopLoss = candleLow - (atrValue * 0.5); // tight buffer
        t1 = candleHigh + (atrValue * 0.5);      // quick target
        t2 = t1 + (atrValue * 0.5);              // fast extension
        t3 = t2 + (atrValue * 0.5);              // trail
        activeSL = stopLoss;
        tslNote = "SCALP MODE ACTIVE";
        signalStrength = "⚡ FAST SCALPING";
        colorCode = "YELLOW"; 
        audioAlert = "chirp";
        if (currentPrice >= t1) {
            activeSL = entryPrice; // break-even
            tslNote = "🛡️ SL AT COST";
        }
        if (currentPrice >= t2) {
            activeSL = t1; // lock profit
            tslNote = "💰 PROFIT LOCKED";
        }
    }

    // --- Popup Notification ---
    popupMessage(`
        🚀 [POWER BOX FINAL] : ${stockName}
        MODE: ${mode.toUpperCase()} | SIGNAL: ${signalStrength}
        ENTRY: ₹${entryPrice} | SL: ₹${activeSL}
        🎯 T1: ₹${t1}, T2: ₹${t2}, T3: ₹${t3}
        STATUS: ${tslNote}
        COLOR: ${colorCode} | AUDIO: ${audioAlert}
    `, "background:#000;color:#0f0;font-family:monospace;");
                                       }
