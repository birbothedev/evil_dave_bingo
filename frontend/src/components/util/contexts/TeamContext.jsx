import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const TeamContext = createContext()

export function TeamFetch({ children }) {
    const navigate = useNavigate()

    const [team, setTeam] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadTeam() {
            try {
                const response = await fetch(`https://api.evildavebingo.com/teams/`, {
                    method: "GET",
                    credentials: "include"
                })
                if (response.status === 401){
                    navigate(`/pageauth/teampage`)
                    return
                }
                const teamData = await response.json()
                if (!teamData) {
                    navigate(`/pageauth/teampage`)
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
        <TeamContext.Provider value={{ team, loading, error }}>
            {children}
        </TeamContext.Provider>
    )
}

export function fetchTeamData() {
    return useContext(TeamContext)
}
