import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getSingleTeam } from "../../../services/api"

const TeamContext = createContext()

export function TeamFetch({ children }) {
    const navigate = useNavigate()

    const [team, setTeam] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadTeam() {
            try {
                const teamData = await getSingleTeam()
                setTeam(teamData)
                console.log(teamData)
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
