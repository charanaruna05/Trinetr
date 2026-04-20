export async function fetchYahooQuote(symbol) {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        const meta = data?.chart?.result?.[0]?.meta;
        
        if (!meta) {
            console.error("Yahoo: No data found for", symbol);
            return null;
        }
        
        return {
            name: symbol,
            ltp: meta.regularMarketPrice,
            volume: meta.regularMarketVolume,
            high: meta.regularMarketDayHigh,
            low: meta.regularMarketDayLow
        };
    } catch (error) {
        console.error("Yahoo fetch error:", error.message);
        return null;
    }
}
