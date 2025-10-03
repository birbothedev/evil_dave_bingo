import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { teamPageFetch } from "../../../services/api"

const TeamContext = createContext()

export function TeamFetch({ children }) {
    const navigate = useNavigate()

    const [team, setTeam] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        async function loadTeam() {
            try {
                const teamData = await teamPageFetch()
                if (!teamData) {
                    setAuthorized(false)
                    navigate(`/pageauth/team`)
                    return
                }
                setTeam(teamData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadTeam()
    }, [])

    return (
        <TeamContext.Provider value={{ team, loading, error, authorized }}>
            {children}
        </TeamContext.Provider>
    )
}

export function fetchTeamData() {
    return useContext(TeamContext)
}
