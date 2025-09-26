import "../css/componentcss/PlayerInfoBoxes.css"
import { fetchTeamData } from "./util/TeamContext";
import { CollapsibleSection } from "./util/Collapsible";
import { addSpaceToCamelCase } from "./util/AddSpaceCamelCase";

export function StatusEffectBox() {

    const { team, loading, error } = fetchTeamData()
    
    if (loading) return <div>Loading Team...</div>
    if (error) return <div>{error}</div>
    if (!team) return <div>No team data found.</div>

    const effects = team.board.tiles.map(tile => ({
        tileId: tile.tileId,
        effect: Object.fromEntries(
            Object.entries(tile.data.effect).filter(([key, value]) => value === true)
        )
    }))

    return (
        <>
        <div className="team-info-box-wrapper">
            <div className="team-status-box">
                <CollapsibleSection label={`${team.name} Status Effects`}>
                    <div className="inventory-items">
                        <div className="inventory-list-text">
                            {effects.flatMap(({ tileId, effect }) =>
                                Object.keys(effect).map(effectKey => (
                                    <div className="inventory-list-text" key={`${tileId}-${effectKey}`}>
                                        Tile {tileId}: {addSpaceToCamelCase(effectKey)}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </CollapsibleSection>
            </div>
        </div>
        </>
    )
}