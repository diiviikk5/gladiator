import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// Suppress Chrome extension errors
window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('Could not establish connection')) {
    e.preventDefault();
  }
});
