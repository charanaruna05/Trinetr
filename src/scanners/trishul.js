// ===============================
// TRISHUL POWER SCANNER SCRIPT
// ===============================

// Signal thresholds (0–100 scale)
function getSignal(score) {
    if (score >= 85) return "Ultra Strong Buy";
    if (score >= 75) return "Strong Buy";
    if (score >= 65) return "Buy";
    if (score >= 50) return "Hold";
    if (score >= 35) return "Sell";
    if (score >= 20) return "Strong Sell";
    return "Ultra Strong Sell";
}

// Color + Bell mapping
function getColorAndBell(signal) {
    switch(signal) {
        case "Ultra Strong Buy": return {color:"darkgreen", bell:"loud_up.mp3"};
        case "Strong Buy": return {color:"green", bell:"medium_up.mp3"};
        case "Buy": return {color:"lightgreen", bell:"soft_up.mp3"};
        case "Hold": return {color:"yellow", bell:"neutral.mp3"};
        case "Sell": return {color:"lightred", bell:"soft_down.mp3"};
        case "Strong Sell": return {color:"red", bell:"medium_down.mp3"};
        case "Ultra Strong Sell": return {color:"darkred", bell:"loud_down.mp3"};
    }
}

// Popup explanation logic
function showPopup(stockName, score, reason) {
    let signal = getSignal(score);
    let {color, bell} = getColorAndBell(signal);

    // Apply color to watchlist box
    document.getElementById(stockName).style.backgroundColor = color;

    // Play bell notification
    playSound(bell);

    // Show popup with explanation
    alert(
        "📊 Stock: " + stockName + "\n" +
        "🎯 Signal: " + signal + "\n" +
        "📈 Score: " + score + "/100\n" +
        "📝 Reason: " + reason
    );
}

// Example usage
// Reliance got fraud news → Sell signal
showPopup("Reliance", 40, "Fraud news reported, heavy negative sentiment.");

// Infosys got big order → Buy signal
showPopup("Infosys", 70, "Big order confirmed, positive momentum.");

// Promoter increased stake → Ultra Strong Buy
showPopup("TataMotors", 90, "Promoter stake increased, insider confidence high.");

// FII heavy selling → Ultra Strong Sell
showPopup("HDFC", 15, "FII heavy selling detected, bearish sentiment.");
