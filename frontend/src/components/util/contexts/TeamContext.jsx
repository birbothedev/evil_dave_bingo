import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { teamPageFetch } from "../../../services/api"

const TeamContext = createContext()

export function TeamFetch({ children }) {
    const { teamValue } = useParams()
    const navigate = useNavigate()

    const [team, setTeam] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        if (!teamValue) {
            console.log("no team value")
            setLoading(false)
            return
        }

        async function loadTeam() {
            try {
                const teamData = await teamPageFetch(teamValue)
                if (!teamData || teamData.name !== teamValue) {
                    setAuthorized(false)
                    navigate(`/pageauth/team`)
                    return
                }
                setTeam(teamData)
            } catch (err) {
                console.error(err)
                setError("Failed to load team")
            } finally {
                setLoading(false)
            }
        }

        loadTeam()
    }, [teamValue])

    return (
        <TeamContext.Provider value={{ team, loading, error, authorized }}>
            {children}
        </TeamContext.Provider>
    )
}

export function fetchTeamData() {
    return useContext(TeamContext)
}
