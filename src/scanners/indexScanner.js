<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Index Power Scanner - Complete Market Analysis</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #0a0a0a;
            font-family: 'Segoe UI', 'Poppins', sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            width: 100%;
            max-width: 700px;
            background: #0f0f0f;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .header {
            background: #1a1a1a;
            padding: 16px;
            text-align: center;
            border-bottom: 1px solid #2a2a2a;
        }
        .header h1 {
            color: #ff9800;
            font-size: 22px;
        }
        .header p {
            color: #888;
            font-size: 10px;
            margin-top: 4px;
        }

        .scan-btn-container {
            padding: 16px;
            text-align: center;
        }
        .scan-btn {
            background: #ff9800;
            border: none;
            border-radius: 30px;
            padding: 12px 30px;
            color: #000;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
        }

        /* Score Boards */
        .score-board {
            background: #1a1a1a;
            margin: 12px;
            border-radius: 16px;
            padding: 12px;
            border: 1px solid #2a2a2a;
        }
        .board-title {
            font-size: 14px;
            font-weight: bold;
            color: #ff9800;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
        }
        .board-items {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .board-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid #2a2a2a;
            font-size: 12px;
        }
        .item-name {
            color: #ccc;
        }
        .item-score {
            font-weight: bold;
        }
        .score-positive {
            color: #4caf50;
        }
        .score-negative {
            color: #f44336;
        }
        .score-neutral {
            color: #ffc107;
        }

        /* Result Card */
        .result-card {
            background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
            margin: 16px;
            padding: 20px;
            border-radius: 20px;
            text-align: center;
            border: 1px solid #2a2a2a;
        }
        .total-score {
            font-size: 48px;
            font-weight: bold;
            color: #ff9800;
        }
        .signal-badge {
            display: inline-block;
            padding: 8px 24px;
            border-radius: 40px;
            font-size: 18px;
            font-weight: bold;
            margin-top: 12px;
        }
        .signal-ultra-buy { background: #1e4a2e; color: #8bc34a; }
        .signal-strong-buy { background: #1e4a2e; color: #4caf50; }
        .signal-buy { background: #1e4a2e; color: #2e7d32; }
        .signal-hold { background: #4a3a1e; color: #ffc107; }
        .signal-sell { background: #4a1e1e; color: #f44336; }
        .signal-strong-sell { background: #4a1e1e; color: #ff8a8a; }
        .signal-ultra-sell { background: #4a1e1e; color: #ff5555; }

        .progress-bar {
            background: #2a2a2a;
            border-radius: 10px;
            height: 8px;
            margin: 12px 0;
            overflow: hidden;
        }
        .progress-fill {
            background: #4caf50;
            height: 100%;
            width: 0%;
            border-radius: 10px;
            transition: width 0.3s;
        }

        .footer {
            padding: 16px;
            text-align: center;
            border-top: 1px solid #2a2a2a;
            font-size: 9px;
            color: #666;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>🎯 INDEX POWER SCANNER</h1>
        <p>Global Indices | PCR | Volume | S/R | Sectors | Commodity | VIX | FII/DII | DXY | Breadth</p>
    </div>

    <div class="scan-btn-container">
        <button class="scan-btn" id="scanBtn">🔍 SCAN MARKET</button>
    </div>

    <div id="boardsContainer"></div>

    <div class="result-card" id="resultCard">
        <div class="total-score" id="totalScore">--</div>
        <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
        <div id="signalDisplay">--</div>
    </div>

    <div class="footer">
        📊 International 20% | PCR+Vol 15% | S/R 15% | Sectors 15% | Commodity 10% | VIX 10% | FII/DII 8% | DXY 7%
    </div>
</div>

<script>
    // Market Data (Simulated - In real app, fetch from API)
    let marketData = {
        // International Indices
        international: { us: 1.2, china: -0.5, japan: 0.8, europe: 1.0, news: "positive" },
        // PCR + Volume + OI
        pcr: 0.65,
        volume: 1.8,
        oi: "increasing",
        // Support/Resistance
        support: { nifty: "support", bankNifty: "support", sensex: "neutral", commodity: "support" },
        // Sectors
        sectors: { green: 12, neutral: 4, red: 4 },
        // Commodities
        commodities: { crude: 2.1, gold: 0.5, naturalGas: 1.2, copper: 0.8 },
        // VIX
        vix: 14.5,
        // FII/DII
        fii: "buy",
        dii: "buy",
        // DXY
        dxy: -0.6,
        // Breadth
        breadth: 2.2
    };

    // Component Scores
    let components = {
        international: { name: "🌍 International Indices & News", weight: 20, score: 0, max: 20 },
        pcrVol: { name: "📊 PCR + Volume + OI Data", weight: 15, score: 0, max: 15 },
        supportResistance: { name: "🎯 Support & Resistance Zones", weight: 15, score: 0, max: 15 },
        sectors: { name: "🏭 Sector Wise Analysis", weight: 15, score: 0, max: 15 },
        commodities: { name: "🛢️ Commodity Indices", weight: 10, score: 0, max: 10 },
        vix: { name: "📈 INDIA VIX (Fear Index)", weight: 10, score: 0, max: 10 },
        fiiDii: { name: "🏦 FII / DII Data", weight: 8, score: 0, max: 8 },
        dxy: { name: "💵 US Dollar Index (DXY)", weight: 7, score: 0, max: 7 }
    };

    function calculateInternational() {
        let data = marketData.international;
        let upCount = 0;
        if (data.us > 0.5) upCount++;
        if (data.china > 0.5) upCount++;
        if (data.japan > 0.5) upCount++;
        if (data.europe > 0.5) upCount++;
        
        let score = 0;
        if (upCount === 4) score = 18;
        else if (upCount === 3) score = 14;
        else if (upCount === 2) score = 8;
        else score = 0;
        
        if (data.news === "positive") score += 2;
        else if (data.news === "negative") score = Math.max(0, score - 5);
        
        return Math.min(20, score);
    }

    function calculatePCRVol() {
        let score = 0;
        if (marketData.pcr < 0.8) score += 8;
        else if (marketData.pcr > 1.2) score = 0;
        else score += 4;
        
        if (marketData.volume > 1.5) score += 4;
        else if (marketData.volume < 0.8) score = Math.max(0, score - 3);
        
        if (marketData.oi === "increasing") score += 3;
        
        return Math.min(15, score);
    }

    function calculateSupportResistance() {
        let score = 0;
        if (marketData.support.nifty === "support") score += 6;
        if (marketData.support.bankNifty === "support") score += 4;
        if (marketData.support.sensex === "support") score += 3;
        if (marketData.support.commodity === "support") score += 2;
        return Math.min(15, score);
    }

    function calculateSectors() {
        let total = marketData.sectors.green + marketData.sectors.neutral + marketData.sectors.red;
        if (total === 0) return 0;
        let buyStrength = (marketData.sectors.green + marketData.sectors.neutral) / total;
        let sellStrength = marketData.sectors.red / total;
        let net = buyStrength - sellStrength;
        let score = (net + 1) / 2 * 15;
        return Math.min(15, Math.max(0, score));
    }

    function calculateCommodities() {
        let score = 0;
        if (marketData.commodities.crude > 0.5) score += 3;
        if (marketData.commodities.gold > 0.3) score += 2;
        if (marketData.commodities.naturalGas > 0.5) score += 3;
        if (marketData.commodities.copper > 0.3) score += 2;
        return Math.min(10, score);
    }

    function calculateVIX() {
        if (marketData.vix < 15) return 10;
        if (marketData.vix < 18) return 7;
        if (marketData.vix < 22) return 4;
        if (marketData.vix < 25) return 2;
        return 0;
    }

    function calculateFIIDII() {
        let score = 0;
        if (marketData.fii === "buy") score += 5;
        if (marketData.dii === "buy") score += 3;
        if (marketData.fii === "sell") score = Math.max(0, score - 3);
        if (marketData.dii === "sell") score = Math.max(0, score - 2);
        return Math.min(8, score);
    }

    function calculateDXY() {
        if (marketData.dxy < -0.5) return 7;
        if (marketData.dxy < -0.2) return 5;
        if (marketData.dxy < 0) return 3;
        if (marketData.dxy < 0.3) return 1;
        return 0;
    }

    function updateAllScores() {
        components.international.score = calculateInternational();
        components.pcrVol.score = calculatePCRVol();
        components.supportResistance.score = calculateSupportResistance();
        components.sectors.score = calculateSectors();
        components.commodities.score = calculateCommodities();
        components.vix.score = calculateVIX();
        components.fiiDii.score = calculateFIIDII();
        components.dxy.score = calculateDXY();
        
        let total = 0;
        for (let key in components) {
            total += components[key].score;
        }
        return total;
    }

    function getSignal(totalScore) {
        let percent = (totalScore / 100) * 100;
        if (percent >= 85) return { text: "ULTRA STRONG BUY", class: "signal-ultra-buy", symbol: "🟢🟢🟢", type: "buy" };
        if (percent >= 75) return { text: "STRONG BUY", class: "signal-strong-buy", symbol: "🟢🟢", type: "buy" };
        if (percent >= 65) return { text: "BUY", class: "signal-buy", symbol: "🟢", type: "buy" };
        if (percent >= 55) return { text: "HOLD / NEUTRAL", class: "signal-hold", symbol: "🟡", type: "hold" };
        if (percent <= 15) return { text: "ULTRA STRONG SELL", class: "signal-ultra-sell", symbol: "🔴🔴🔴", type: "sell" };
        if (percent <= 25) return { text: "STRONG SELL", class: "signal-strong-sell", symbol: "🔴🔴", type: "sell" };
        if (percent <= 35) return { text: "SELL", class: "signal-sell", symbol: "🔴", type: "sell" };
        return { text: "HOLD / NEUTRAL", class: "signal-hold", symbol: "🟡", type: "hold" };
    }

    function renderBoards() {
        let html = '';
        for (let key in components) {
            let comp = components[key];
            let scoreClass = comp.score >= comp.max/2 ? 'score-positive' : (comp.score <= comp.max/4 ? 'score-negative' : 'score-neutral');
            html += `
                <div class="score-board">
                    <div class="board-title">${comp.name}</div>
                    <div class="board-item">
                        <span class="item-name">Score</span>
                        <span class="item-score ${scoreClass}">${comp.score} / ${comp.max}</span>
                    </div>
                </div>
            `;
        }
        document.getElementById('boardsContainer').innerHTML = html;
    }

    function renderResult(totalScore) {
        document.getElementById('totalScore').innerHTML = `${totalScore}%`;
        document.getElementById('progressFill').style.width = `${totalScore}%`;
        let signal = getSignal(totalScore);
        document.getElementById('signalDisplay').innerHTML = `<span class="signal-badge ${signal.class}">${signal.symbol} ${signal.text}</span>`;
    }

    function randomizeMarketData() {
        marketData = {
            international: {
                us: (Math.random() * 2) - 1,
                china: (Math.random() * 2) - 1,
                japan: (Math.random() * 2) - 1,
                europe: (Math.random() * 2) - 1,
                news: Math.random() > 0.7 ? "positive" : (Math.random() > 0.5 ? "neutral" : "negative")
            },
            pcr: 0.5 + Math.random() * 1,
            volume: 0.5 + Math.random() * 2,
            oi: Math.random() > 0.6 ? "increasing" : "decreasing",
            support: {
                nifty: Math.random() > 0.6 ? "support" : "resistance",
                bankNifty: Math.random() > 0.6 ? "support" : "resistance",
                sensex: Math.random() > 0.6 ? "support" : "resistance",
                commodity: Math.random() > 0.6 ? "support" : "resistance"
            },
            sectors: {
                green: Math.floor(Math.random() * 15),
                neutral: Math.floor(Math.random() * 10),
                red: Math.floor(Math.random() * 10)
            },
            commodities: {
                crude: (Math.random() * 3) - 1.5,
                gold: (Math.random() * 2) - 1,
                naturalGas: (Math.random() * 3) - 1.5,
                copper: (Math.random() * 2) - 1
            },
            vix: 10 + Math.random() * 20,
            fii: Math.random() > 0.6 ? "buy" : "sell",
            dii: Math.random() > 0.6 ? "buy" : "sell",
            dxy: (Math.random() * 2) - 1,
            breadth: 0.5 + Math.random() * 3
        };
    }

    function scan() {
        randomizeMarketData();
        let totalScore = updateAllScores();
        renderBoards();
        renderResult(totalScore);
    }

    document.getElementById('scanBtn').addEventListener('click', scan);
    scan();
</script>
</body>
</html>
