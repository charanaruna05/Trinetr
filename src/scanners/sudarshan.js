<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Sudarshan Scanner - Price Action Based Trading App</title>
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
            max-width: 600px;
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
            font-size: 12px;
            margin-top: 4px;
        }

        .stock-input {
            padding: 16px;
            background: #0f0f0f;
        }
        .input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 16px;
        }
        .input-group input {
            flex: 1;
            background: #1a1a1a;
            border: 1px solid #2a2a2a;
            border-radius: 12px;
            padding: 12px;
            color: #fff;
            font-size: 14px;
            outline: none;
        }
        .input-group input:focus {
            border-color: #ff9800;
        }
        .input-group button {
            background: #ff9800;
            border: none;
            border-radius: 12px;
            padding: 0 20px;
            color: #000;
            font-weight: bold;
            cursor: pointer;
        }

        .indicators-section {
            padding: 0 16px;
            margin-bottom: 16px;
        }
        .section-title {
            color: #aaa;
            font-size: 12px;
            margin-bottom: 8px;
            font-weight: bold;
        }
        .indicator-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        .indicator-card {
            background: #1a1a1a;
            border-radius: 12px;
            padding: 10px;
            border: 1px solid #2a2a2a;
        }
        .indicator-name {
            font-size: 11px;
            color: #888;
            margin-bottom: 4px;
        }
        .indicator-value {
            font-size: 14px;
            font-weight: bold;
            color: #ff9800;
        }
        .indicator-status {
            font-size: 10px;
            margin-top: 4px;
        }
        .status-true {
            color: #4caf50;
        }
        .status-false {
            color: #f44336;
        }

        .result-card {
            background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
            margin: 16px;
            padding: 20px;
            border-radius: 20px;
            text-align: center;
            border: 1px solid #2a2a2a;
        }
        .score-value {
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

        .signal-stand {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin: 16px 0;
        }
        .signal-bar {
            width: 40px;
            height: 50px;
            background: #2a2a2a;
            border-radius: 8px;
            transition: all 0.3s;
        }
        .signal-bar.active {
            background: #4caf50;
        }

        .footer {
            padding: 16px;
            text-align: center;
            border-top: 1px solid #2a2a2a;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>⚡ SUDARSHAN SCANNER</h1>
        <p>Price Action Based | 8 Indicators | Multiples of 10</p>
    </div>

    <div class="stock-input">
        <div class="input-group">
            <input type="text" id="stockName" placeholder="Stock Name (e.g., RELIANCE)" value="RELIANCE">
            <input type="number" id="currentPrice" placeholder="Price" value="2450">
            <button id="scanBtn">🔍 SCAN</button>
        </div>
    </div>

    <div class="indicators-section">
        <div class="section-title">📊 INDICATOR VALUES</div>
        <div class="indicator-grid" id="indicatorGrid"></div>
    </div>

    <div class="result-card" id="resultCard">
        <div class="score-value" id="scoreValue">--</div>
        <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
        <div class="signal-stand" id="signalStand">
            <div class="signal-bar"></div><div class="signal-bar"></div><div class="signal-bar"></div>
            <div class="signal-bar"></div><div class="signal-bar"></div><div class="signal-bar"></div>
            <div class="signal-bar"></div><div class="signal-bar"></div>
        </div>
        <div id="signalDisplay">--</div>
    </div>

    <div class="footer">
        📊 Volume+OI+PCR 15% | Prev Day 10% | Day S/R 10% | Horizontal S/R 10%<br>
        📈 Trendline 10% | Range 10% | Candlestick 15% | Chart Pattern 20%
    </div>
</div>

<script>
    class SudarshanScanner {
        constructor(data) {
            this.data = data;
        }

        // Check BUY conditions
        checkBuyConditions() {
            const d = this.data;
            return {
                volumeOI: d.volume > d.avgVolume * 1.5 && d.oiIncreasing && d.pcr < 0.8,
                prevDay: d.price <= d.prevDayLow * 1.01 && d.price >= d.prevDayLow * 0.99,
                daySR: d.price <= d.daySupport * 1.01 && d.price >= d.daySupport * 0.99,
                horizontalSR: d.price <= d.horizontalSupport * 1.01 && d.price >= d.horizontalSupport * 0.99,
                trendline: d.trendlineBreak === "up",
                range: d.rangeBreak === "up",
                candlestick: d.candlestickPattern === "bullish_engulfing",
                chartPattern: d.chartPattern === "inverse_hs"
            };
        }

        // Check SELL conditions
        checkSellConditions() {
            const d = this.data;
            return {
                volumeOI: d.volume < d.avgVolume * 0.8 && d.oiIncreasing && d.pcr > 1.2,
                prevDay: d.price >= d.prevDayHigh * 0.99 && d.price <= d.prevDayHigh * 1.01,
                daySR: d.price >= d.dayResistance * 0.99 && d.price <= d.dayResistance * 1.01,
                horizontalSR: d.price >= d.horizontalResistance * 0.99 && d.price <= d.horizontalResistance * 1.01,
                trendline: d.trendlineBreak === "down",
                range: d.rangeBreak === "down",
                candlestick: d.candlestickPattern === "bearish_engulfing",
                chartPattern: d.chartPattern === "hs"
            };
        }

        // Calculate Score (Multiple of 10)
        calculateScore(conditions) {
            const weights = {
                volumeOI: 15,
                prevDay: 10,
                daySR: 10,
                horizontalSR: 10,
                trendline: 10,
                range: 10,
                candlestick: 15,
                chartPattern: 20
            };
            
            let score = 0;
            for (let key in conditions) {
                if (conditions[key]) {
                    score += weights[key];
                }
            }
            return score;
        }

        // Get Signal based on score
        getSignal(score, type) {
            if (type === "buy") {
                if (score >= 85) return { text: "ULTRA STRONG BUY", class: "signal-ultra-buy", symbol: "🟢🟢🟢" };
                if (score >= 75) return { text: "STRONG BUY", class: "signal-strong-buy", symbol: "🟢🟢" };
                if (score >= 65) return { text: "BUY", class: "signal-buy", symbol: "🟢" };
                if (score >= 50) return { text: "HOLD / WAIT", class: "signal-hold", symbol: "🟡" };
                return { text: "NO SIGNAL", class: "signal-hold", symbol: "⚪" };
            } else {
                if (score >= 85) return { text: "ULTRA STRONG SELL", class: "signal-ultra-sell", symbol: "🔴🔴🔴" };
                if (score >= 75) return { text: "STRONG SELL", class: "signal-strong-sell", symbol: "🔴🔴" };
                if (score >= 65) return { text: "SELL", class: "signal-sell", symbol: "🔴" };
                if (score >= 50) return { text: "HOLD / WAIT", class: "signal-hold", symbol: "🟡" };
                return { text: "NO SIGNAL", class: "signal-hold", symbol: "⚪" };
            }
        }

        scan() {
            const buyConditions = this.checkBuyConditions();
            const sellConditions = this.checkSellConditions();
            
            const buyScore = this.calculateScore(buyConditions);
            const sellScore = this.calculateScore(sellConditions);
            
            if (buyScore >= 65 && buyScore > sellScore) {
                const signal = this.getSignal(buyScore, "buy");
                return { score: buyScore, signal, conditions: buyConditions, type: "buy" };
            } else if (sellScore >= 65 && sellScore > buyScore) {
                const signal = this.getSignal(sellScore, "sell");
                return { score: sellScore, signal, conditions: sellConditions, type: "sell" };
            } else {
                const signal = this.getSignal(Math.max(buyScore, sellScore), "hold");
                return { score: Math.max(buyScore, sellScore), signal, conditions: buyConditions, type: "hold" };
            }
        }
    }

    function getStockData(stockName, price) {
        const isReliance = stockName.toUpperCase() === "RELIANCE";
        const isTata = stockName.toUpperCase() === "TATA STEEL";
        
        if (isReliance) {
            return {
                name: "RELIANCE",
                price: price,
                volume: 2200000,
                avgVolume: 1000000,
                oiIncreasing: true,
                pcr: 0.65,
                prevDayHigh: 2520,
                prevDayLow: 2420,
                daySupport: 2430,
                dayResistance: 2480,
                horizontalSupport: 2420,
                horizontalResistance: 2500,
                trendlineBreak: "up",
                rangeBreak: "up",
                candlestickPattern: "bullish_engulfing",
                chartPattern: "inverse_hs"
            };
        } else if (isTata) {
            return {
                name: "TATA STEEL",
                price: price,
                volume: 600000,
                avgVolume: 1000000,
                oiIncreasing: true,
                pcr: 1.35,
                prevDayHigh: 152,
                prevDayLow: 142,
                daySupport: 143,
                dayResistance: 148,
                horizontalSupport: 140,
                horizontalResistance: 150,
                trendlineBreak: "down",
                rangeBreak: "down",
                candlestickPattern: "bearish_engulfing",
                chartPattern: "hs"
            };
        } else {
            return {
                name: stockName,
                price: price,
                volume: 1000000,
                avgVolume: 1000000,
                oiIncreasing: false,
                pcr: 1.0,
                prevDayHigh: price + 15,
                prevDayLow: price - 15,
                daySupport: price - 10,
                dayResistance: price + 10,
                horizontalSupport: price - 20,
                horizontalResistance: price + 20,
                trendlineBreak: "none",
                rangeBreak: "none",
                candlestickPattern: "none",
                chartPattern: "none"
            };
        }
    }

    function updateUI(scanner, stockData) {
        const result = scanner.scan();
        
        document.getElementById('scoreValue').innerHTML = `${result.score}`;
        document.getElementById('progressFill').style.width = `${result.score}%`;
        
        const signalDiv = document.getElementById('signalDisplay');
        signalDiv.innerHTML = `<span class="signal-badge ${result.signal.class}">${result.signal.symbol} ${result.signal.text}</span>`;
        
        const bars = document.querySelectorAll('.signal-bar');
        const activeBars = Math.floor(result.score / 12.5);
        bars.forEach((bar, i) => {
            if (i < activeBars) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        });
        
        const conditions = result.conditions;
        const indicatorNames = {
            volumeOI: "📊 Volume+OI+PCR (15%)",
            prevDay: "📈 Prev Day High/Low (10%)",
            daySR: "🎯 Day S/R (10%)",
            horizontalSR: "📉 Horizontal S/R (10%)",
            trendline: "📈 Trendline Breakout (10%)",
            range: "📊 Range Breakout (10%)",
            candlestick: "🕯️ Candlestick Pattern (15%)",
            chartPattern: "📉 Chart Pattern (20%)"
        };
        
        let html = '';
        for (let key in conditions) {
            const status = conditions[key];
            let value = '';
            if (key === 'volumeOI') value = `Vol:${(stockData.volume/1000000).toFixed(1)}M | OI:${stockData.oiIncreasing ? '↑' : '↓'} | PCR:${stockData.pcr}`;
            else if (key === 'prevDay') value = `Prev High:${stockData.prevDayHigh} | Prev Low:${stockData.prevDayLow}`;
            else if (key === 'daySR') value = `Day Sup:${stockData.daySupport} | Day Res:${stockData.dayResistance}`;
            else if (key === 'horizontalSR') value = `Horiz Sup:${stockData.horizontalSupport} | Horiz Res:${stockData.horizontalResistance}`;
            else if (key === 'trendline') value = stockData.trendlineBreak === 'up' ? 'Upward Breakout' : (stockData.trendlineBreak === 'down' ? 'Downward Breakout' : 'No Breakout');
            else if (key === 'range') value = stockData.rangeBreak === 'up' ? 'Range Up Breakout' : (stockData.rangeBreak === 'down' ? 'Range Down Breakout' : 'No Breakout');
            else if (key === 'candlestick') value = stockData.candlestickPattern === 'bullish_engulfing' ? 'Bullish Engulfing' : (stockData.candlestickPattern === 'bearish_engulfing' ? 'Bearish Engulfing' : 'No Pattern');
            else if (key === 'chartPattern') value = stockData.chartPattern === 'inverse_hs' ? 'Inverse H&S' : (stockData.chartPattern === 'hs' ? 'Head & Shoulders' : 'No Pattern');
            
            html += `
                <div class="indicator-card">
                    <div class="indicator-name">${indicatorNames[key]}</div>
                    <div class="indicator-value">${value}</div>
                    <div class="indicator-status ${status ? 'status-true' : 'status-false'}">
                        ${status ? '✅ Condition Met' : '❌ Condition Failed'}
                    </div>
                </div>
            `;
        }
        document.getElementById('indicatorGrid').innerHTML = html;
    }

    document.getElementById('scanBtn').addEventListener('click', () => {
        const stockName = document.getElementById('stockName').value;
        const price = parseFloat(document.getElementById('currentPrice').value);
        
        if (!stockName || isNaN(price)) {
            alert('Please enter valid stock name and price');
            return;
        }
        
        const stockData = getStockData(stockName, price);
        const scanner = new SudarshanScanner(stockData);
        updateUI(scanner, stockData);
    });
    
    setTimeout(() => {
        document.getElementById('scanBtn').click();
    }, 100);
</script>
</body>
</html>
