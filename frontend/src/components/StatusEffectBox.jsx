import "../css/componentcss/PlayerInfoBoxes.css"

export function StatusEffectBox({team}) {
    return (
        <>
        <div className="team-info-box">
            <div className="team-title">This is {team} name</div>
            <h3>This is the Status Effect box</h3>
        </div>
        </>
    )
}