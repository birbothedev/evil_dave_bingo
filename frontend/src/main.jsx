import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './css/index.css'
import App from './App.jsx'
import { TeamFetch } from './components/util/TeamContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TeamFetch>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TeamFetch>
  </StrictMode>,
)
