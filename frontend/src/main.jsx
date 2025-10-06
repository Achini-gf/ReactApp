import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // global base styles
import App from './App.jsx' // my main React component

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />       
  </StrictMode>,
)
