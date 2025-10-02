
import './css/App.css'
import { Routes, Route } from "react-router-dom"
import { HomePage } from './pages/HomePage'
import { TeamPage } from './pages/TeamPage'
import { NavBar } from './components/util/NavBar'
import { AdminPage } from './pages/AdminPage'
import { PageAuth } from './components/util/PageAuth'
import { TeamFetch } from './components/util/contexts/TeamContext'
import { HomeFetchAllTeams } from './components/util/contexts/FetchAllTeamsContext'
import { AdminFetch } from './components/util/contexts/AdminContext'

function App() {
  return (
    <div>
      <NavBar />
      <div className='main-content'>
        <Routes>
          <Route path="/" element={
                <HomeFetchAllTeams>
                    <HomePage />
                </HomeFetchAllTeams>
            } />
          <Route path="/teampage" 
            element={
                <TeamFetch>
                    <TeamPage />
                </TeamFetch>
            } />
          <Route path="/adminpage" element={
              <AdminFetch>
                <AdminPage />
              </AdminFetch>
            } />
          <Route path="/pageauth/:page" element={<PageAuth />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
