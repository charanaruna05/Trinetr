<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Brahmastra Scanner - Trading App</title>
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
            max-width: 550px;
            background: #0f0f0f;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        /* Header */
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

        /* Stock Input */
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

        /* Indicator Values Section */
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
            font-size: 18px;
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

        /* Result Card */
        .result-card {
            background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
            margin: 16px;
            padding: 20px;
            border-radius: 20px;
            text-align: center;
            border: 1px solid #2a2a2a;
        }
        .strength-value {
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
        .signal-strong-buy { background: #1e4a2e; color: #8bc34a; }
        .signal-buy { background: #1e4a2e; color: #4caf50; }
        .signal-hold { background: #4a3a1e; color: #ffc107; }
        .signal-sell { background: #4a1e1e; color: #f44336; }
        .signal-strong-sell { background: #4a1e1e; color: #ff8a8a; }

        /* Progress Bar */
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

        /* Signal Stand */
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
        <h1>🔱 BRAHMASTRA SCANNER</h1>
        <p>Ultra Level | 6 Indicators | Weighted Accuracy</p>
    </div>

    <div class="stock-input">
        <div class="input-group">
            <input type="text" id="stockName" placeholder="Stock Name (e.g., RELIANCE)" value="RELIANCE">
            <input type="number" id="currentPrice" placeholder="Price" value="2450">
            <button id="scanBtn">🔍 SCAN</button>
        </div>
    </div>

    <div class="indicators-section">
        <div class="section-title">📊 INDICATOR VALUES (Live Data)</div>
        <div class="indicator-grid" id="indicatorGrid">
            <!-- Dynamic content -->
        </div>
    </div>

    <div class="result-card" id="resultCard">
        <div id="strengthDisplay">--%</div>
        <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
        <div class="signal-stand" id="signalStand">
            <div class="signal-bar"></div><div class="signal-bar"></div><div class="signal-bar"></div><div class="signal-bar"></div><div class="signal-bar"></div>
        </div>
        <div id="signalDisplay">--</div>
    </div>

    <div class="footer">
        📈 Volume 25% | VWAP 20% | Pivot 18% | RSI 15% | EMA 12% | ADX 10%
    </div>
</div>

<script>
    // Brahmastra Scanner Logic
    class BrahmastraScanner {
        constructor(data) {
            this.data = data;
        }

        // Check BUY conditions
        checkBuyConditions() {
            const d = this.data;
            return {
                volume: d.volume > d.avgVolume * 1.5,
                vwap: d.price > d.vwap,
                pivot: d.pivot === "support",
                rsi: d.rsi > 55,
                ema: d.price < d.ema,
                adx: d.adx > 24
            };
        }

        // Check SELL conditions
        checkSellConditions() {
            const d = this.data;
            return {
                volume: d.volume < d.avgVolume * 0.8,
                vwap: d.price < d.vwap,
                pivot: d.pivot === "resistance",
                rsi: d.rsi < 45,
                ema: d.price > d.ema,
                adx: d.adx > 24
            };
        }

        // Calculate Strength
        calculateStrength(conditions) {
            const weights = {
                volume: 0.25,
                vwap: 0.20,
                pivot: 0.18,
                rsi: 0.15,
                ema: 0.12,
                adx: 0.10
            };
            
            let strength = 0;
            for (let key in conditions) {
                if (conditions[key]) {
                    strength += weights[key] * 100;
                }
            }
            return Math.round(strength);
        }

        // Get Signal based on strength
        getSignal(strength, type) {
            if (type === "buy") {
                if (strength >= 85) return { text: "ULTRA STRONG BUY", class: "signal-strong-buy", symbol: "🟢🟢🟢" };
                if (strength >= 75) return { text: "STRONG BUY", class: "signal-strong-buy", symbol: "🟢🟢" };
                if (strength >= 65) return { text: "BUY", class: "signal-buy", symbol: "🟢" };
                return { text: "HOLD / NO SIGNAL", class: "signal-hold", symbol: "⚪" };
            } else {
                if (strength >= 85) return { text: "ULTRA STRONG SELL", class: "signal-strong-sell", symbol: "🔴🔴🔴" };
                if (strength >= 75) return { text: "STRONG SELL", class: "signal-strong-sell", symbol: "🔴🔴" };
                if (strength >= 65) return { text: "SELL", class: "signal-sell", symbol: "🔴" };
                return { text: "HOLD / NO SIGNAL", class: "signal-hold", symbol: "⚪" };
            }
        }

        // Run scanner
        scan() {
            const buyConditions = this.checkBuyConditions();
            const sellConditions = this.checkSellConditions();
            
            const buyStrength = this.calculateStrength(buyConditions);
            const sellStrength = this.calculateStrength(sellConditions);
            
            if (buyStrength >= 65 && buyStrength > sellStrength) {
                const signal = this.getSignal(buyStrength, "buy");
                return { strength: buyStrength, signal, conditions: buyConditions, type: "buy" };
            } else if (sellStrength >= 65 && sellStrength > buyStrength) {
                const signal = this.getSignal(sellStrength, "sell");
                return { strength: sellStrength, signal, conditions: sellConditions, type: "sell" };
            } else {
                const signal = { text: "HOLD / NO SIGNAL", class: "signal-hold", symbol: "⚪" };
                return { strength: 0, signal, conditions: buyConditions, type: "hold" };
            }
        }
    }

    // Sample stock data (in real app, this would come from API)
    function getStockData(stockName, price) {
        // Simulate different indicators based on stock name
        const isReliance = stockName.toUpperCase() === "RELIANCE";
        const isTata = stockName.toUpperCase() === "TATA STEEL";
        
        if (isReliance) {
            return {
                name: "RELIANCE",
                price: price,
                volume: 2200000,
                avgVolume: 1000000,
                vwap: 2420,
                pivot: "support",
                rsi: 62,
                ema: 2480,
                adx: 28
            };
        } else if (isTata) {
            return {
                name: "TATA STEEL",
                price: price,
                volume: 600000,
                avgVolume: 1000000,
                vwap: 148,
                pivot: "resistance",
                rsi: 42,
                ema: 142,
                adx: 26
            };
        } else {
            return {
                name: stockName,
                price: price,
                volume: 1000000,
                avgVolume: 1000000,
                vwap: price - 10,
                pivot: "neutral",
                rsi: 52,
                ema: price + 5,
                adx: 18
            };
        }
    }

    // Update UI
    function updateUI(scanner, stockData) {
        const result = scanner.scan();
        
        // Update strength display
        document.getElementById('strengthDisplay').innerHTML = `<div class="strength-value">${result.strength}%</div>`;
        document.getElementById('progressFill').style.width = `${result.strength}%`;
        
        // Update signal
        const signalDiv = document.getElementById('signalDisplay');
        signalDiv.innerHTML = `<span class="signal-badge ${result.signal.class}">${result.signal.symbol} ${result.signal.text}</span>`;
        
        // Update signal stand (5 bars)
        const bars = document.querySelectorAll('.signal-bar');
        const activeBars = Math.floor(result.strength / 20);
        bars.forEach((bar, i) => {
            if (i < activeBars) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        });
        
        // Update indicator grid
        const conditions = result.conditions;
        const weights = { volume: 25, vwap: 20, pivot: 18, rsi: 15, ema: 12, adx: 10 };
        const indicatorNames = {
            volume: "📊 Volume", vwap: "📈 VWAP", pivot: "🎯 Pivot", rsi: "📉 RSI", ema: "📈 EMA 20", adx: "📊 ADX"
        };
        
        let html = '';
        for (let key in conditions) {
            const status = conditions[key];
            const value = key === 'volume' ? `${(stockData.volume/1000000).toFixed(1)}M` :
                         key === 'vwap' ? stockData.vwap :
                         key === 'pivot' ? (stockData.pivot === 'support' ? 'Support' : (stockData.pivot === 'resistance' ? 'Resistance' : 'Neutral')) :
                         key === 'rsi' ? stockData.rsi :
                         key === 'ema' ? stockData.ema :
                         key === 'adx' ? stockData.adx : '--';
            
            html += `
                <div class="indicator-card">
                    <div class="indicator-name">${indicatorNames[key]} (${weights[key]}%)</div>
                    <div class="indicator-value">${value}</div>
                    <div class="indicator-status ${status ? 'status-true' : 'status-false'}">
                        ${status ? '✅ Condition Met' : '❌ Condition Failed'}
                    </div>
                </div>
            `;
        }
        document.getElementById('indicatorGrid').innerHTML = html;
    }

    // Scan button click
    document.getElementById('scanBtn').addEventListener('click', () => {
        const stockName = document.getElementById('stockName').value;
        const price = parseFloat(document.getElementById('currentPrice').value);
        
        if (!stockName || isNaN(price)) {
            alert('Please enter valid stock name and price');
            return;
        }
        
        const stockData = getStockData(stockName, price);
        const scanner = new BrahmastraScanner(stockData);
        updateUI(scanner, stockData);
    });
    
    // Initial scan
    setTimeout(() => {
        document.getElementById('scanBtn').click();
    }, 100);
</script>
</body>
</html>
