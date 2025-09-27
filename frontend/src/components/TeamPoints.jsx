import "../css/componentcss/PlayerInfoBoxes.css"
import { fetchTeamData } from "./util/TeamContext"

export function TeamPoints() {
    const { team, loading, error } = fetchTeamData()

    if (loading) return <div>Loading Team...</div>
    if (error) return <div>{error}</div>
    if (!team?.board) return <div>No board data found.</div>

    return (
        <>
        <div className="team-info-box-wrapper">
            <div className="team-points-box">
                <h3 className="team-info-title">{team.score}</h3>
            </div>
        </div>
        </>
    )
}