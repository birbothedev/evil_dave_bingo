import "../css/componentcss/PlayerInfoBoxes.css"

export function StatusEffectBox({team}) {
    return (
        <>
        <div className="team-info-box-wrapper">
            <div className="team-info-box">
                <h3 className="team-info-title">This is the status effect box for {team}</h3>
            </div>
        </div>
        </>
    )
}