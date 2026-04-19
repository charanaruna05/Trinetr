// ==========================
// Indicator Functions (Options)
// ==========================

function autoAnchoredVolumeProfile(price, avgVolume, currentVolume, demandZone, supplyZone, weight) {
    let signal = 0;
    if (currentVolume / avgVolume >= 1.5 && price >= demandZone) signal = +1;
    else if (currentVolume / avgVolume >= 1.5 && price <= supplyZone) signal = -1;
    return signal * weight;
}

function volumeProfileHD(price, hvn, currentVolume, avgVolume, weight) {
    let signal = 0;
    if (price > hvn && currentVolume > avgVolume) signal = +1;
    else if (price < hvn && currentVolume > avgVolume * 1.5) signal = -1;
    return signal * weight;
}

function sessionVolumeProfileHD(price, vwap, currentVolume, avgVolume, weight) {
    let signal = 0;
    if (price > vwap && currentVolume > avgVolume) signal = +1;
    else if (price < vwap && currentVolume > avgVolume * 1.5) signal = -1;
    return signal * weight;
}

// इसी तरह बाकी indicators के लिए functions होंगे…

// ==========================
// Group Functions
// ==========================

function group1(price, avgVolume, currentVolume, demandZone, supplyZone, vwap, hvn) {
    let g1 = 0;
    g1 += autoAnchoredVolumeProfile(price, avgVolume, currentVolume, demandZone, supplyZone, 3);
    g1 += volumeProfileHD(price, hvn, currentVolume, avgVolume, 2);
    g1 += sessionVolumeProfileHD(price, vwap, currentVolume, avgVolume, 5);
    return g1; // Total = 10
}

function group2(smc, supplyDemand, flowScore) {
    return smc * 3 + supplyDemand * 2 + flowScore * 5;
}

function group3(hma, wavetrend, qqe) {
    return hma * 2 + wavetrend * 3 + qqe * 5;
}

function group4(bollinger, cmf, nvi) {
    return bollinger * 2 + cmf * 3 + nvi * 5;
}

function group5(elderImpulse, peakTracker, visibleRange) {
    return elderImpulse * 2 + peakTracker * 3 + visibleRange * 5;
}

function group6(fixedRange, supertrend, extraIndicator) {
    return fixedRange * 2 + supertrend * 3 + extraIndicator * 5;
}

function group7(custom1, custom2, custom3) {
    return custom1 * 2 + custom2 * 3 + custom3 * 5;
}

// ==========================
// Scanner Hub + Notification
// ==========================

function scannerHub(groups, stockName, reasons) {
    let finalScore = 0;
    for (let g of groups) {
        finalScore += g;
    }

    // Normalize to 0–100
    let normalizedScore = (finalScore / (7 * 10)) * 100;

    // Thresholds + Popup
    let color = "white";
    let signal = "Neutral Zone - No Trade";

    if (normalizedScore >= 55 && normalizedScore < 61) {
        color = "orange";
        signal = "Alert Mode (Orange)";
    } else if (normalizedScore >= 61 && normalizedScore < 76) {
        color = "green";
        signal = "BUY Confirmed (Green)";
    } else if (normalizedScore >= 76 && normalizedScore < 90) {
        color = "darkgreen";
        signal = "Strong BUY (Dark Green)";
    } else if (normalizedScore >= 90) {
        color = "brightgreen";
        signal = "Ultra Strong BUY (Bright Green)";
    }

    // Popup Content
    let popup = `
    Stock: ${stockName}
    Score: ${normalizedScore.toFixed(2)}
    Signal: ${signal}
    Reason(s):
    - ${reasons.join("\n    - ")}
    `;

    alert(popup);

    return {score: normalizedScore, signal: signal, color: color};
}

// ==========================
// Example Usage
// ==========================

let g1 = group1(102, 100, 160, 101, 99, 100, 100);
let g2 = group2(1, 1, 1);
let g3 = group3(1, 1, 1);
let g4 = group4(1, 1, 1);
let g5 = group5(1, 1, 1);
let g6 = group6(1, 1, 1);
let g7 = group7(1, 1, 1);

let result = scannerHub(
    [g1, g2, g3, g4, g5, g6, g7],
    "RELIANCE",
    [
        "Auto Anchored Volume Profile: Volume spike ×1.5 at Demand Zone",
        "Smart Money Concepts: Demand Zone hold + bullish candle",
        "FlowScore: Liquidity inflow strong"
    ]
);

console.log("Final Scanner Score:", result.score, "Signal:", result.signal, "Color:", result.color);
