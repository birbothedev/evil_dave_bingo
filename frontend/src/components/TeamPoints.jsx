import "../css/componentcss/PlayerInfoBoxes.css"

export function TeamPoints({team}) {
    return (
        <>
        <div className="team-info-box-wrapper">
            <div className="team-points-box">
                <h3 className="team-info-title">Points: {team.score}</h3>
            </div>
        </div>
        </>
    )
}