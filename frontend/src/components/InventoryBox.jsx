import "../css/componentcss/PlayerInfoBoxes.css"

export function InventoryBox({team}) {
    return (
        <>
            <div className="team-info-box">
                <div className="team-title">This is {team} name</div>
                <h3>This is the inventory box</h3>
            </div>
        </>
    )
}