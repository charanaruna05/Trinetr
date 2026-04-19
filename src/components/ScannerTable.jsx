// --- ULTIMATE AUTO-UPDATE + POWER BOX + UI ---
// One Unified Script

import React, { useState, useEffect } from 'react';

// --- CONFIGURATION ---
const UPDATE_CONFIG = {
    PRICE_UPDATE_INTERVAL: 15,
    SCANNER_UPDATE_INTERVAL: 30,
    NOTIFICATION_CHECK_INTERVAL: 15,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
};

// --- POWER BOX FINAL HYBRID ENGINE ---
function powerBoxFinal(stockName, currentPrice, atrValue, pivotLevels, fibLevels, avgVolume, candleVolume, quantityInput, mode, candleLow, candleHigh) {
    let entryPrice = currentPrice || 0;
    let stopLoss, t1, t2, t3, activeSL, tslNote, signalStrength, colorCode, audioAlert, score = 50;

    try {
        if (mode.toLowerCase() === "average") {
            stopLoss = Math.min(entryPrice - atrValue, pivotLevels.support);
            t1 = (entryPrice + (atrValue * 1.2) + fibLevels["38.2"]) / 2;
            t2 = (entryPrice + (atrValue * 1.5) + fibLevels["61.8"]) / 2;
            t3 = (entryPrice + (atrValue * 2) + fibLevels["100"]) / 2;
            activeSL = stopLoss;
            signalStrength = (candleVolume > avgVolume * 2) ? "⚡ STRONG MIX" : "✅ NORMAL MIX";
            score = (candleVolume / avgVolume) * 50;
            tslNote = "AVERAGE MODE ACTIVE";
            colorCode = "GREEN"; 
            audioAlert = "chime";
        }
        else if (mode.toLowerCase() === "intraday") {
            stopLoss = Math.min(entryPrice - atrValue, pivotLevels.support);
            t1 = Math.max(entryPrice + (atrValue * 1.2), fibLevels["38.2"]);
            t2 = Math.max(entryPrice + (atrValue * 1.5), fibLevels["61.8"]);
            t3 = Math.max(entryPrice + (atrValue * 2), fibLevels["100"]);
            activeSL = stopLoss;
            tslNote = "INTRADAY MODE ACTIVE";
            signalStrength = (candleVolume > avgVolume * 2) ? "⚡ STRONG INTRADAY" : "✅ NORMAL INTRADAY";
            score = (candleVolume / avgVolume) * 60;
            colorCode = "BLUE"; 
            audioAlert = "tick-tak";
        }
        else if (mode.toLowerCase() === "intradayfixed") {
            let slDistance = entryPrice * 0.01;
            stopLoss = entryPrice - slDistance;
            t1 = entryPrice + (slDistance * 1.2);
            t2 = entryPrice + (slDistance * 1.5);
            t3 = entryPrice + (slDistance * 2);
            activeSL = stopLoss;
            tslNote = "FIXED MODE ACTIVE";
            signalStrength = "📊 FIXED CALCULATION";
            score = 70;
            colorCode = "ORANGE"; 
            audioAlert = "buzz";
        }
        else if (mode.toLowerCase() === "scalp") {
            stopLoss = candleLow - (atrValue * 0.5);
            t1 = candleHigh + (atrValue * 0.5);
            t2 = t1 + (atrValue * 0.5);
            t3 = t2 + (atrValue * 0.5);
            activeSL = stopLoss;
            tslNote = "SCALP MODE ACTIVE";
            signalStrength = "⚡ FAST SCALPING";
            score = 90;
            colorCode = "YELLOW"; 
            audioAlert = "chirp";
            if (currentPrice >= t1) { activeSL = entryPrice; tslNote = "🛡️ SL AT COST"; }
            if (currentPrice >= t2) { activeSL = t1; tslNote = "💰 PROFIT LOCKED"; }
        }

        return { name: stockName, signal: signalStrength, entry: entryPrice, sl: activeSL, targets: { t1, t2, t3 }, score, color: colorCode };
    } catch (error) {
        return { name: stockName, signal: `⚠️ ERROR: ${error.message}`, entry: 0, sl: 0, targets: { t1:0,t2:0,t3:0 }, score:0, color:"red" };
    }
}

// --- AUTO UPDATE SYSTEM ---
class AutoUpdateSystem {
    constructor() {
        this.isRunning = false;
        this.intervals = [];
        this.subscribers = { scanner: [] };
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startScannerUpdates();
        console.log("🚀 [SYSTEM] Started");
    }

    subscribe(type, callback) {
        this.subscribers[type].push(callback);
        return () => this.unsubscribe(type, callback);
    }

    unsubscribe(type, callback) {
        this.subscribers[type] = this.subscribers[type].filter(cb => cb !== callback);
    }

    notifySubscribers(type, data) {
        this.subscribers[type].forEach(cb => cb(data));
    }

    startScannerUpdates() {
        const int = setInterval(() => {
            // Dummy data for demo
            const signals = [
                powerBoxFinal("RELIANCE", 3000, 25, {support:2950}, {"38.2":3050,"61.8":3100,"100":3200}, 100000, 250000, 100, "intraday", 2980, 3020),
                powerBoxFinal("TCS", 3500, 30, {support:3450}, {"38.2":3550,"61.8":3600,"100":3700}, 80000, 120000, 50, "average", 3480, 3520)
            ];
            this.notifySubscribers('scanner', signals);
        }, UPDATE_CONFIG.SCANNER_UPDATE_INTERVAL * 1000);
        this.intervals.push(int);
    }
}

const autoSystem = new AutoUpdateSystem();
autoSystem.start();

// --- REACT UI ---
const ScannerTable = () => {
    const [signals, setSignals] = useState([]);

    useEffect(() => {
        const unsubscribe = autoSystem.subscribe('scanner', (newSignals) => {
            setSignals(newSignals);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div style={{ padding: '10px', backgroundColor: '#121212', color: 'white' }}>
            <h2 style={{ textAlign: 'center', color: '#00d2ff' }}>Trinetr Scanner Hub</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>SCANNER</th>
                        <th>SIGNAL</th>
                        <th>ENTRY</th>
                        <th>TGT / SL</th>
                    </tr>
                </thead>
                <tbody>
                    {signals.length > 0 ? (
                        signals.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.name}</td>
                                <td style={{ color: item.color }}>{item.signal} ({item.score}/100)</td>
                                <td>{item.entry}</td>
                                <td style={{ fontSize: '12px' }}>
                                    <span style={{ color: 'green' }}>T:{item.targets.t1}</span><br/>
                                    <span style={{ color: 'red' }}>SL:{item.sl}</span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                Scanning Market... Please wait.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ScannerTable;
