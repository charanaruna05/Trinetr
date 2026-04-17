// ============================================================
// FILE: src/main.jsx
// PURPOSE: App entry — सिर्फ screens जोड़ता है, logic नहीं
// ============================================================

import { StrictMode } from 'react';
import { createRoot }  from 'react-dom/client';
import App             from './App.jsx';
import '../global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
