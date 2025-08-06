import "../css/componentcss/PlayerInfoBoxes.css"

export function InventoryBox({team}) {
    return (
        <>
        <div className="team-info-box-wrapper">
            <div className="team-info-box">
                <h3 className="team-info-title">This is the inventory box for {team}</h3>
            </div>
        </div>
        </>
    )
}