<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes, viewport-fit=cover">
    <title>SCALE SCANNER - NIFTY/SENSEX Only</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; overflow: hidden; background: #000; }
        body { font-family: system-ui; padding: 8px; color: #e0e0e0; display: flex; flex-direction: column; height: 100%; }
        .dashboard { flex: 1; display: flex; flex-direction: column; overflow: hidden; max-width: 600px; margin: 0 auto; width: 100%; }
        
        .notification-toast { position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background: #1a1a1a; border-left: 4px solid #f39c12; padding: 10px 16px; border-radius: 12px; display: none; align-items: center; gap: 12px; z-index: 1000; animation: slideDown 0.3s ease; }
        .notification-toast.show { display: flex; }
        .notification-text { font-size: 0.75rem; }
        .notification-close { background: none; border: none; color: #aaa; font-size: 1rem; cursor: pointer; }
        @keyframes slideDown { from { top: -50px; opacity: 0; } to { top: 10px; opacity: 1; } }
        
        .watchlist-container { flex-shrink: 0; margin-bottom: 6px; background: #0a0a0a; border-radius: 12px; border: 1px solid #2a2a2a; overflow-x: auto; overflow-y: hidden; }
        .watchlist-track { display: flex; width: max-content; }
        .watchlist-item { display: flex; gap: 12px; padding: 6px 12px; background: #0f0f0f; border-right: 1px solid #2a2a2a; font-size: 0.65rem; white-space: nowrap; align-items: center; }
        .alert-badge { background: #e67e22; padding: 2px 8px; border-radius: 20px; color: white; font-weight: bold; animation: blink 1s infinite; }
        .alert-buy { background: #16a34a; }
        .alert-sell { background: #dc2626; }
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
        
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 6px; flex-shrink: 0; }
        .stat-card { background: #0a0a0a; border-left: 3px solid #f39c12; padding: 5px; border-radius: 12px; text-align: center; }
        .stat-card h3 { font-size: 0.55rem; color: #aaa; margin-bottom: 2px; }
        .stat-number { font-size: 1.2rem; font-weight: 700; color: #f39c12; }
        
        .scale-card { background: #0a0a0a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 10px; margin-bottom: 6px; flex-shrink: 0; text-align: center; }
        .scale-title { font-size: 0.8rem; font-weight: bold; color: #f39c12; margin-bottom: 8px; }
        .scale-price { font-size: 1.2rem; font-weight: bold; margin: 5px 0; }
        .scale-signal { font-size: 0.7rem; padding: 4px 12px; border-radius: 20px; display: inline-block; }
        
        .six-boxes { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 6px; flex-shrink: 0; }
        .power-box { background: #0c0c0c; text-align: center; padding: 10px; border-radius: 12px; border: 1px solid #2c2c2c; font-size: 0.7rem; font-weight: bold; cursor: pointer; }
        .power-box.active { border-color: #f39c12; background: #1a1a1a; }
        
        .icon-row { display: flex; justify-content: space-around; background: #0a0a0a; padding: 5px 8px; border-radius: 40px; border: 1px solid #2a2a2a; flex-shrink: 0; }
        .icon-item { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 0.9rem; color: #aaa; cursor: pointer; }
        .icon-label { font-size: 0.4rem; }
    </style>
</head>
<body>
<div class="dashboard">
    <div id="notificationToast" class="notification-toast">
        <span class="notification-icon">📱</span>
        <span class="notification-text" id="toastMessage">SMS: New Signal</span>
        <button class="notification-close" onclick="closeToast()">✕</button>
    </div>
    
    <div class="watchlist-container"><div class="watchlist-track" id="watchlistTrack"></div></div>
    
    <div class="stats-row">
        <div class="stat-card"><h3>📈 TOTAL BUY</h3><div class="stat-number" id="totalBuy">0</div></div>
        <div class="stat-card"><h3>📉 TOTAL SELL</h3><div class="stat-number" id="totalSell">0</div></div>
        <div class="stat-card"><h3>🔔 TOTAL</h3><div class="stat-number" id="totalSignals">0</div></div>
    </div>
    
    <div class="scale-card" id="niftyCard">
        <div class="scale-title">🇮🇳 NIFTY 50</div>
        <div class="scale-price" id="niftyPrice">₹24,500</div>
        <div class="scale-signal" id="niftySignal">⚪ WAITING</div>
    </div>
    
    <div class="scale-card" id="sensexCard">
        <div class="scale-title">📊 SENSEX</div>
        <div class="scale-price" id="sensexPrice">₹81,500</div>
        <div class="scale-signal" id="sensexSignal">⚪ WAITING</div>
    </div>
    
    <div class="six-boxes" id="scannerBoxes"></div>
    
    <div class="icon-row">
        <div class="icon-item"><div>🏠</div><div class="icon-label">HOME</div></div>
        <div class="icon-item"><div>📊</div><div class="icon-label">CHART</div></div>
        <div class="icon-item"><div>📋</div><div class="icon-label">WATCH</div></div>
    </div>
</div>

<script>
    // SCALE SCANNER - Only NIFTY and SENSEX
    
    const instruments = [
        { name: "NIFTY", price: 24500, ema7: 24450, vwap: 24400, volume: 1800000, avgVolume: 1200000, adx: 32, rsi: 68, higherHigh: true, supportReversal: true, resistanceReversal: false, time9am: true },
        { name: "SENSEX", price: 81500, ema7: 81400, vwap: 81300, volume: 1600000, avgVolume: 1100000, adx: 28, rsi: 62, higherHigh: false, supportReversal: false, resistanceReversal: true, time9am: true }
    ];
    
    let notifications = [];
    let buyCount = 0, sellCount = 0;
    
    function calculateScore(data) {
        let score = 0;
        
        // 7 EMA + VWAP (25 points)
        if (data.price > data.ema7 && data.price > data.vwap) score += 25;
        
        // Support Reversal (20 points)
        if (data.supportReversal) score += 20;
        
        // Resistance Reversal (20 points)
        if (data.resistanceReversal) score += 20;
        
        // Volume Spike (15 points)
        if (data.volume > data.avgVolume * 1.5) score += 15;
        
        // Higher High / Lower Low (10 points)
        if (data.higherHigh) score += 10;
        
        // ADX Strength (10 points)
        if (data.adx >= 25) score += 10;
        
        return score;
    }
    
    function getSignal(score) {
        if (score >= 85) return "ULTRA STRONG BUY";
        if (score >= 75) return "STRONG BUY";
        if (score >= 62) return "BUY";
        if (score <= -85) return "ULTRA STRONG SELL";
        if (score <= -75) return "STRONG SELL";
        if (score <= -62) return "SELL";
        return "WAITING";
    }
    
    function getFinalSignal(score) {
        if (score >= 62) return "BUY";
        if (score <= -62) return "SELL";
        return "NEUTRAL";
    }
    
    function addToWatchList(name, signal, price) {
        const track = document.getElementById('watchlistTrack');
        const time = new Date().toLocaleTimeString();
        const alertClass = signal === 'BUY' ? 'alert-buy' : 'alert-sell';
        const alertText = signal === 'BUY' ? '🔔 BUY ALERT' : '🔔 SELL ALERT';
        
        const item = document.createElement('div');
        item.className = 'watchlist-item';
        item.innerHTML = `<span class="alert-badge ${alertClass}">${alertText}</span><span>${name}</span><span>PRICE: ₹${price}</span><span>${signal}</span><span>${time}</span>`;
        track.appendChild(item);
        track.scrollLeft = track.scrollWidth;
    }
    
    function showNotification(name, signal, price, score) {
        const toast = document.getElementById('notificationToast');
        const toastMsg = document.getElementById('toastMessage');
        toastMsg.innerHTML = `📱 SMS: ${name} - ${signal} SIGNAL | PRICE: ₹${price} | SCORE: ${score}`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }
    
    function updateStats(signal) {
        if (signal === 'BUY') buyCount++;
        else if (signal === 'SELL') sellCount++;
        document.getElementById('totalBuy').innerHTML = buyCount;
        document.getElementById('totalSell').innerHTML = sellCount;
        document.getElementById('totalSignals').innerHTML = buyCount + sellCount;
    }
    
    function updateInstrument(data, index) {
        const score = calculateScore(data);
        const signalText = getSignal(score);
        const finalSignal = getFinalSignal(score);
        
        // Update card
        const cardId = data.name === 'NIFTY' ? 'niftyCard' : 'sensexCard';
        const priceId = data.name === 'NIFTY' ? 'niftyPrice' : 'sensexPrice';
        const signalId = data.name === 'NIFTY' ? 'niftySignal' : 'sensexSignal';
        
        document.getElementById(priceId).innerHTML = `₹${data.price}`;
        
        const signalSpan = document.getElementById(signalId);
        if (finalSignal === 'BUY') {
            signalSpan.innerHTML = '🟢 BUY SIGNAL';
            signalSpan.style.background = '#16a34a';
            signalSpan.style.color = 'white';
        } else if (finalSignal === 'SELL') {
            signalSpan.innerHTML = '🔴 SELL SIGNAL';
            signalSpan.style.background = '#dc2626';
            signalSpan.style.color = 'white';
        } else {
            signalSpan.innerHTML = '⚪ WAITING';
            signalSpan.style.background = '#555';
            signalSpan.style.color = 'white';
        }
        
        // If signal generated, send to Watch List and Notification
        if (finalSignal !== 'NEUTRAL') {
            addToWatchList(data.name, finalSignal, data.price);
            showNotification(data.name, finalSignal, data.price, score);
            updateStats(finalSignal);
        }
    }
    
    function updateAll() {
        instruments.forEach((item, idx) => {
            updateInstrument(item, idx);
        });
    }
    
    function renderBoxes() {
        const container = document.getElementById('scannerBoxes');
        container.innerHTML = '';
        const boxes = ['NIFTY', 'SENSEX'];
        boxes.forEach((name, i) => {
            const box = document.createElement('div');
            box.className = 'power-box' + (i === 0 ? ' active' : '');
            const icon = name === 'NIFTY' ? '🇮🇳' : '📊';
            box.innerHTML = `${icon} ${name}<br><small>SCALE SCAN</small>`;
            box.onclick = () => {
                document.querySelectorAll('.power-box').forEach(b => b.classList.remove('active'));
                box.classList.add('active');
                // Just highlight, data already showing
            };
            container.appendChild(box);
        });
    }
    
    function closeToast() {
        document.getElementById('notificationToast').classList.remove('show');
    }
    
    renderBoxes();
    updateAll();
    
    // Auto refresh every 5 seconds (simulate live data)
    setInterval(() => {
        instruments[0].price = Math.floor(24500 + (Math.random() - 0.5) * 100);
        instruments[1].price = Math.floor(81500 + (Math.random() - 0.5) * 300);
        updateAll();
    }, 5000);
</script>
</body>
</html>
