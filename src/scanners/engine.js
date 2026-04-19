// Power Box Final Hybrid Engine
export const powerBoxEngine = (params) => {
    const { 
        stockName, currentPrice, atrValue, pivotLevels, 
        fibLevels, avgVolume, candleVolume, quantityInput, 
        mode, candleLow, candleHigh 
    } = params;
    
    let entryPrice = currentPrice;
    let stopLoss, t1, t2, t3, activeSL, tslNote, signalStrength, colorCode, audioAlert;

    // --- Mode Logic ---
    if (mode.toLowerCase() === "average") {
        stopLoss = Math.min(entryPrice - atrValue, pivotLevels.support);
        t1 = (entryPrice + (atrValue * 1.2) + fibLevels["38.2"]) / 2;
        t2 = (entryPrice + (atrValue * 1.5) + fibLevels["61.8"]) / 2;
        t3 = (entryPrice + (atrValue * 2) + fibLevels["100"]) / 2;
        activeSL = stopLoss;
        signalStrength = (candleVolume > avgVolume * 2) ? "STRONG_MIX" : "NORMAL_MIX";
        tslNote = "AVERAGE_MODE_ACTIVE";
        colorCode = "#00FF00"; 
        audioAlert = "chime";
    }

    else if (mode.toLowerCase() === "intraday") {
        stopLoss = Math.min(entryPrice - atrValue, pivotLevels.support);
        t1 = Math.max(entryPrice + (atrValue * 1.2), fibLevels["38.2"]);
        t2 = Math.max(entryPrice + (atrValue * 1.5), fibLevels["61.8"]);
        t3 = Math.max(entryPrice + (atrValue * 2), fibLevels["100"]);
        activeSL = stopLoss;
        tslNote = "INTRADAY_MODE_ACTIVE";
        signalStrength = (candleVolume > avgVolume * 2) ? "STRONG_INTRADAY" : "NORMAL_INTRADAY";
        colorCode = "#0000FF"; 
        audioAlert = "tick-tak";
    }

    else if (mode.toLowerCase() === "intradayfixed") {
        let slDistance = entryPrice * 0.01;
        stopLoss = entryPrice - slDistance;
        t1 = entryPrice + (slDistance * 1.2);
        t2 = entryPrice + (slDistance * 1.5);
        t3 = entryPrice + (slDistance * 2);
        activeSL = stopLoss;
        tslNote = "FIXED_MODE_ACTIVE";
        signalStrength = "FIXED_CALCULATION";
        colorCode = "#FFA500"; 
        audioAlert = "buzz";
    }

    else if (mode.toLowerCase() === "scalp") {
        stopLoss = candleLow - (atrValue * 0.5);
        t1 = candleHigh + (atrValue * 0.5);
        t2 = t1 + (atrValue * 0.5);
        t3 = t2 + (atrValue * 0.5);
        activeSL = stopLoss;
        tslNote = "SCALP_MODE_ACTIVE";
        signalStrength = "FAST_SCALPING";
        colorCode = "#FFFF00"; 
        audioAlert = "chirp";
        if (currentPrice >= t1) { activeSL = entryPrice; tslNote = "SL_AT_COST"; }
        if (currentPrice >= t2) { activeSL = t1; tslNote = "PROFIT_LOCKED"; }
    }

    return {
        stockName,
        mode: mode.toUpperCase(),
        signal: signalStrength,
        entry: entryPrice,
        sl: activeSL.toFixed(2),
        targets: { t1: t1.toFixed(2), t2: t2.toFixed(2), t3: t3.toFixed(2) },
        status: tslNote,
        color: colorCode,
        audio: audioAlert
    };
};
  
