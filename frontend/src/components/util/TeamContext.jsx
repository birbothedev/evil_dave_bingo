import { createContext, useContext, useEffect, useState } from "react";
import { teamPageFetch } from "../../services/api";

const TeamContext = createContext()

export function TeamFetch({children}){
    const [team, setTeam] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadTeam(){
            try {
                const teamData = await teamPageFetch()
                setTeam(teamData)
            } catch (err) {
                console.error(err)
                setError("Failed to load team")
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
