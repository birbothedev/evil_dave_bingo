import "../css/componentcss/PlayerInfoBoxes.css"
import { fetchTeamData } from "./util/TeamContext"

export function TeamPoints({ team: teamProp }) {

    let team = teamProp
    let loading = false
    let error = null

    // changes fetch based on if prop is passed or not
    if (!teamProp) {
        const fetchResult = fetchTeamData()
        if (fetchResult) {
            team = fetchResult.team
            loading = fetchResult.loading
            error = fetchResult.error
        }
    } 

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