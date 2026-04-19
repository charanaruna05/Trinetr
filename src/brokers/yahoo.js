// src/brokers/yahoo.js
import yahooFinance from 'yahoo-finance2';

export async function fetchYahooQuote(symbol) {
    try {
        const quote = await yahooFinance.quote(symbol);
        return {
            name: symbol,
            ltp: quote.regularMarketPrice,
            volume: quote.regularMarketVolume,
            high: quote.regularMarketDayHigh,
            low: quote.regularMarketDayLow
        };
    } catch (error) {
        console.error("Yahoo fetch error:", error.message);
        return null;
    }
}
