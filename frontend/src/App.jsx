import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css/App.css'
import { Routes, Route } from "react-router-dom"
import { HomePage } from './pages/HomePage'
import { TeamPage } from './pages/TeamPage'
import { NavBar } from './components/NavBar'
import { AdminPage } from './pages/AdminPage'

function App() {
  return (
    <div>
      <NavBar />
      <div className='main-content'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teampage" element={<TeamPage />} />
          <Route path="/adminpage" element={<AdminPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
