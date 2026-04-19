import { powerBoxEngine } from './engine';

/**
 * CENTRAL SCANNER HUB
 * Maps each scanner to a specific execution mode in the Hybrid Engine.
 */

// 1. Brahmastra - Uses Average Mode for mixed signals
export const brahmastra = (data) => powerBoxEngine({ ...data, mode: 'average' });

// 2. Sudarshan - Focuses on Intraday trends
export const sudarshan = (data) => powerBoxEngine({ ...data, mode: 'intraday' });

// 3. Trishul - Uses 1% Fixed SL Strategy
export const trishul = (data) => powerBoxEngine({ ...data, mode: 'intradayfixed' });

// 4. All In One - Versatile Average Mode
export const allInOne = (data) => powerBoxEngine({ ...data, mode: 'average' });

// 5. Index Scanner - Optimized for Nifty/BankNifty Intraday
export const indexScanner = (data) => powerBoxEngine({ ...data, mode: 'intraday' });

// 6. Mahakal - High-speed Scalping
export const mahakal = (data) => powerBoxEngine({ ...data, mode: 'scalp' });

// 7. Bhairav - High-speed Scalping
export const bhairav = (data) => powerBoxEngine({ ...data, mode: 'scalp' });

// 8. Morning Bell - Opening range Scalping
export const morningBell = (data) => powerBoxEngine({ ...data, mode: 'scalp' });

// 9. Scalp Nine - Fast 9-period Scalping
export const scalpNine = (data) => powerBoxEngine({ ...data, mode: 'scalp' });

// Unified Export for the UI components
export const allScanners = {
    brahmastra,
    sudarshan,
    trishul,
    allInOne,
    indexScanner,
    mahakal,
    bhairav,
    morningBell,
    scalpNine
};
