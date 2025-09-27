
import './css/App.css'
import { Routes, Route } from "react-router-dom"
import { HomePage } from './pages/HomePage'
import { TeamPage } from './pages/TeamPage'
import { NavBar } from './components/util/NavBar'
import { AdminPage } from './pages/AdminPage'
import { PageAuth } from './components/util/PageAuth'
import { TeamFetch } from './components/util/TeamContext'

function App() {
  return (
    <div>
      <NavBar />
      <div className='main-content'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teampage/:teamValue" 
            element={
                <TeamFetch>
                    <TeamPage />
                </TeamFetch>
            } />
          <Route path="/adminpage" element={<AdminPage />} />
          <Route path="/pageauth/:page" element={<PageAuth />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
