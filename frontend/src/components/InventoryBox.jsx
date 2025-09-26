import "../css/componentcss/PlayerInfoBoxes.css"
import { CollapsibleSection } from "./util/Collapsible";
import { fetchTeamData } from "./util/TeamContext";
import { getTimeRemaining } from "./util/TimeRemaining";
import { useState, useEffect } from "react";

export function InventoryBox() {

    const { team, loading, error } = fetchTeamData()
    const [timeLeft, setTimeLeft] = useState([])

    useEffect(() => {
        if (!team?.inventory?.extermination) return

        const interval = setInterval(() => {
            const times = team.inventory.extermination.map(ex => getTimeRemaining(ex.useBefore))
            setTimeLeft(times)
        }, 60000);

        return () => clearInterval(interval)
    }, [team])

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
                    <CollapsibleSection label={`${team.name} Inventory`}>
                        <div className="inventory-items">
                            <div className="inventory-list-items">
                                {regularItems.map(([type, value]) => (
                                    <div className="inventory-list-text" key={type}>Tile {type}: {value}</div>
                                ))}

                                {exterminations.length > 0 && (
                                    <>
                                        {exterminations.map((ex, index) => (
                                            <div className="time-remaining" key={index}>
                                                Extermination: {getTimeRemaining(ex.useBefore).toLowerCase()}
                                            </div>
                                        ))}
                                    </>
                                )}

                                {regularItems.length === 0 && exterminations.length === 0 && (
                                    <h3>No items in inventory</h3>
                                )}
                            </div>
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
        </>
    )
}