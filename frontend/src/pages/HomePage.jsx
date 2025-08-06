import { SmallBingoBoard } from "../components/SmallBingoBoard";
import "../css/HomePage.css"
import { useEffect, useState } from "react";
import { fetchTeams } from "../services/api";

export function HomePage(){
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

    if (loading) return <div>Loading Teams...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="home-page">
            <h3 className="page-title">EVIL DAVE'S TOTALLY EVIL BINGO EVENT</h3>
            <div className="bingo-container">
                {teams.map((team, index) => (
                    <div className="team-groups" key={index}>
                        <SmallBingoBoard team={team} />
                    </div>
                ))}
            </div>
        </div>
    );
}