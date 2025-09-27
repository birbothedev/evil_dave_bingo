import "../css/componentcss/PlayerInfoBoxes.css"
import { CollapsibleSection } from "./util/Collapsible";
import { fetchTeamData } from "./util/TeamContext";
import { CountdownComponent } from "./util/Timers/CountdownComponent";

export function InventoryBox() { 
    const { team, loading, error } = fetchTeamData()

    if (loading) return <div>Loading Team...</div>
    if (error) return <div>{error}</div>
    if (!team) return <div>No team data found.</div>

    const regularItems = Object.entries(team.inventory || {})
        .filter(([type, value]) => type !== "extermination" && value > 0);

    const exterminations = (team.inventory?.extermination || [])
        .filter(x => x.active && !x.used)
    
    return (
        <>
        <div className="team-info-box-wrapper">
            <div className="team-info-box">
            <CollapsibleSection label={`Inventory`}>
                <div className="inventory-items">
                    <div className="inventory-list-items">
                        {regularItems.map(([type, value]) => (
                            <div className="inventory-list-text" key={type}>• Tile {type}: {value}</div>
                        ))}

                        {exterminations.length > 0 && (
                            <>
                                {exterminations.map((ex, index) => (
                                    <div className="time-remaining" key={index}>
                                        {`• Extermination (time remaining:`} <CountdownComponent useBy={ex.useBy} /> {`)`}
                                    </div>
                                ))}
                            </>
                        )}

                        {regularItems.length === 0 && exterminations.length === 0 && (
                            <div className="inventory-list-text">No items in inventory</div>
                        )}
                    </div>
                </div>
            </CollapsibleSection>
            </div>
        </div>
        </>
    )
}