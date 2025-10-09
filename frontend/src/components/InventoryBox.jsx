import "../css/componentcss/PlayerInfoBoxes.css"
import { CollapsibleSection } from "./util/Collapsible"
import { fetchTeamData } from "./util/contexts/TeamContext"
import { CountdownComponent } from "./util/Timers/CountdownComponent"

export function InventoryBox({ team: teamProp }) { 

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
    if (!team) return <div>No team data found.</div>

    const regularItems = Object.entries(team.inventory || {})
        .filter(([type, value]) => type !== "extermination" && value > 0);

    const exterminations = (team.inventory?.extermination || [])
        .filter(x => x.active && !x.used)

    const exterminationTimer = exterminations[0]?.useBefore
    
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
                                        {`• Extermination (`} <CountdownComponent useBy={exterminationTimer} /> {`)`}
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