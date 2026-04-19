// ALL IN ONE - LOGIC JUNCTION & DATA HANDOVER
// Complete working version

// Mock function to get Brahmastra status
function fetchBrahmastraStatus(stockSymbol) {
    // Simulate different statuses based on stock symbol
    const statusMap = {
        'RELIANCE': 'ULTRA',
        'TCS': 'STRONG',
        'HDFC BANK': 'STRONG',
        'INFOSYS': 'ULTRA',
        'ICICI BANK': 'NORMAL',
        'BHARTI': 'ULTRA',
        'ITC': 'NORMAL',
        'WIPRO': 'STRONG'
    };
    return { status: statusMap[stockSymbol] || 'NORMAL' };
}

// Mock function to get Trishul status
function fetchTrishulStatus(stockSymbol) {
    const statusMap = {
        'RELIANCE': 'STRONG',
        'TCS': 'NORMAL',
        'HDFC BANK': 'ULTRA',
        'INFOSYS': 'STRONG',
        'ICICI BANK': 'NORMAL',
        'BHARTI': 'STRONG',
        'ITC': 'NORMAL',
        'WIPRO': 'ULTRA'
    };
    return { status: statusMap[stockSymbol] || 'NORMAL' };
}

// Mock function to get Sudarshan status
function fetchSudarshanStatus(stockSymbol) {
    const statusMap = {
        'RELIANCE': 'STRONG',
        'TCS': 'ULTRA',
        'HDFC BANK': 'NORMAL',
        'INFOSYS': 'ULTRA',
        'ICICI BANK': 'STRONG',
        'BHARTI': 'NORMAL',
        'ITC': 'STRONG',
        'WIPRO': 'NORMAL'
    };
    return { status: statusMap[stockSymbol] || 'NORMAL' };
}

// Mock function to get market price
function getMarketPrice(symbol) {
    const priceMap = {
        'RELIANCE': 2460,
        'TCS': 3890,
        'HDFC BANK': 1678,
        'INFOSYS': 1540,
        'ICICI BANK': 1125,
        'BHARTI': 1580,
        'ITC': 425,
        'WIPRO': 480
    };
    return priceMap[symbol] || 1000;
}

// Function to process new entry in table
function processNewEntryInTable(payload) {
    console.log('[TABLE] New Entry:', payload);
    
    // Dispatch event for table update
    window.dispatchEvent(new CustomEvent('tableNewEntry', { detail: payload }));
    
    // Also try to update UI if elements exist
    let tableBody = document.getElementById('scanner-results');
    if(tableBody) {
        let row = document.createElement('tr');
        row.style.borderBottom = '1px solid #2a2a2a';
        row.innerHTML = `
            <td style="padding:6px">${payload.name}</td>
            <td style="padding:6px">₹${payload.ltp}</td>
            <td style="padding:6px;color:${payload.type.includes('BUY') ? '#22c55e' : '#f0a30a'}">${payload.power}%</td>
            <td style="padding:6px">${payload.type}</td>
        `;
        tableBody.prepend(row);
    }
    
    // Show notification
    let toast = document.getElementById('notification-toast');
    if(!toast){
        toast = document.createElement('div');
        toast.id = 'notification-toast';
        toast.style.cssText = 'position:fixed;top:50px;left:10px;right:10px;background:#16a34a;color:#fff;padding:8px;border-radius:8px;font-size:11px;text-align:center;z-index:9999;display:none';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `📢 ${payload.name} - ${payload.type} | POWER: ${payload.power}%`;
    toast.style.display = 'block';
    toast.style.background = payload.type.includes('BUY') ? '#16a34a' : '#dc2626';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// Main master logic junction
function masterLogicJunction(stockSymbol) {
    // 1. RECEIVE INPUT DATA FROM THREE SCANNERS
    const bData = fetchBrahmastraStatus(stockSymbol);
    const tData = fetchTrishulStatus(stockSymbol);
    const sData = fetchSudarshanStatus(stockSymbol);

    let masterScore = 0;

    // 2. APPLY PLUS POINT LOGIC
    // Points: BUY=20, STRONG=25 (+5), ULTRA=35 (+15)
    masterScore += (bData.status === "ULTRA") ? 35 : (bData.status === "STRONG" ? 25 : 20);
    masterScore += (tData.status === "ULTRA") ? 35 : (tData.status === "STRONG" ? 25 : 20);
    masterScore += (sData.status === "ULTRA") ? 35 : (sData.status === "STRONG" ? 25 : 20);

    // 3. FINAL VALIDATION (DECISION MAKING)
    let finalVerdict = "";
    if (masterScore >= 90) {
        finalVerdict = "ULTRA STRONG BUY";
    } else if (masterScore >= 80) {
        finalVerdict = "STRONG BUY";
    } else if (masterScore >= 60) {
        finalVerdict = "BUY SIGNAL";
    } else {
        finalVerdict = "NO SIGNAL";
    }

    // 4. HANDOVER TO ENTRY/EXIT TABLE
    if (masterScore >= 60) {
        executeTableHandoff(stockSymbol, finalVerdict, masterScore);
    }
    
    return { stock: stockSymbol, verdict: finalVerdict, score: masterScore };
}

function executeTableHandoff(symbol, verdict, score) {
    // Transferring all processed data to the Master Table
    const signalPayload = {
        name: symbol,
        type: verdict,
        power: score,
        ltp: getMarketPrice(symbol),
        timestamp: new Date().toLocaleTimeString()
    };

    // Calling the Table's primary function to start the trade process
    processNewEntryInTable(signalPayload);
}

// Export for use in other files
window.masterLogicJunction = masterLogicJunction;
window.fetchBrahmastraStatus = fetchBrahmastraStatus;
window.fetchTrishulStatus = fetchTrishulStatus;
window.fetchSudarshanStatus = fetchSudarshanStatus;
window.getMarketPrice = getMarketPrice;
window.processNewEntryInTable = processNewEntryInTable;
