import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './css/index.css'
import App from './App.jsx'
import { GlobalTeamFetch } from './components/util/GlobalTeamFetch.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalTeamFetch>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalTeamFetch>
  </StrictMode>,
)
