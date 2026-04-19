// Morning Bell Scanner – Unified Logic
// Author: Charan (Mogal Industries – Raksha)
// Project: Morning Bell
// Purpose: High accuracy stock scanner with ₹500+ price filter

For each Stock in Nifty100 {

    // Step 1: Price Filter
    If (StockPrice < 500) {
        Exclude stock
        Continue
    }

    // Step 2: Initialize Score
    Score = 0

    // Step 3: Apply Filters with Voltage Weightage
    If (Top15 Gainers/Losers OK) {
        Score += 10
    }
    If (15-min Candle Breakout OK) {
        Score += 20
    }
    If (Sector Support OK) {
        Score += 20
    }
    If (CMF > 0 AND OBV Rising) {
        Score += 25
    }
    If (Index Align OK) {
        Score += 15
    }

    // Step 4: Normalize Score to 0–100 Meter
    FinalScore = (Score / 90) * 100

    // Step 5: Signal Classification (Score Meter Thresholds)
    If (FinalScore ≥ 90) {
        Signal = "Ultra Strong BUY/SELL"
    }
    Else If (FinalScore ≥ 76) {
        Signal = "Strong BUY/SELL"
    }
    Else If (FinalScore ≥ 61) {
        Signal = "Confirmed BUY/SELL"   // ✅ Entry Trigger
    }
    Else If (FinalScore ≥ 55) {
        Signal = "Alert Mode"
    }
    Else {
        Signal = "Neutral"
    }

    // Step 6: Output
    Display {
        StockName,
        StockPrice,
        FinalScore,
        Signal
    }
}
