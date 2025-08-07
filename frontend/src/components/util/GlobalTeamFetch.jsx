import { createContext, useState, useEffect } from "react"
import { fetchTeams } from "../../services/api"
import { useContext } from "react"

const GlobalTeamContext = createContext()

export function GlobalTeamFetch({children}){
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() =>{
        async function getData() {
            try {
                const teamData = await fetchTeams()
                setTeams(teamData)
            } catch (err) {
                console.error(err)
                setError("Failed to load teams")
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    return (
        <GlobalTeamContext.Provider value={{teams, loading, error}}>
            {children}
        </GlobalTeamContext.Provider>
    )
}

export function useTeamFetch() {
    return useContext(GlobalTeamContext)
}