import "../css/componentcss/PlayerInfoBoxes.css"

export function TeamPoints({team}) {
    // points = team.points
    const points = 0
    return (
        <>
        <div className="team-info-box-wrapper">
            <div className="team-points-box">
                <h3 className="team-info-title">Points: {points}</h3>
            </div>
        </div>
        </>
    )
}