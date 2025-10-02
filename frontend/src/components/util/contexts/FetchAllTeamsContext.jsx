import { createContext, useState, useEffect } from "react"
import { fetchAllTeams } from "../../../services/api"
import { useContext } from "react"

const AllTeamsContext = createContext()

export function HomeFetchAllTeams({children}){
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() =>{
        async function getData() {
            try {
                const teamData = await fetchAllTeams()
                setTeams(teamData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    return (
        <AllTeamsContext.Provider value={{teams, loading, error}}>
            {children}
        </AllTeamsContext.Provider>
    )
}

export function useAllTeamsFetch() {
    return useContext(AllTeamsContext)
}