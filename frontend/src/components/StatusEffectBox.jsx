import "../css/componentcss/PlayerInfoBoxes.css"
import { fetchTeamData } from "./util/TeamContext";
import { CollapsibleSection } from "./util/Collapsible";
import { addSpaceToCamelCase } from "./util/AddSpaceCamelCase";
import { CountdownComponent } from "./util/Timers/CountdownComponent";

export function StatusEffectBox() {

    const { team, loading, error } = fetchTeamData()
    
    if (loading) return <div>Loading Team...</div>
    if (error) return <div>{error}</div>
    if (!team) return <div>No team data found.</div>

    const effects = team.board.tiles.map(tile => ({
        tileId: tile.tileId,
        tileIndex: tile.index,
        effect: Object.fromEntries(
            Object.entries(tile.data.effect).filter(([key, value]) => value === true)
        )
    })).filter(tile => Object.keys(tile.effect).length > 0)

    const now = Date.now() / 1000;
    const exterminationTimer = team?.lastExtermination
    const secondsLeft = Math.max(0, Math.floor(exterminationTimer - now));

    return (
        <>
        <div className="team-info-box-wrapper">
            <div className="team-status-box">
                <CollapsibleSection label={`${team.name} Status Effects`}>
                    <div className="inventory-items">
                        <div className="inventory-list-text">
                            {secondsLeft > 0 && (
                                <div className="time-remaining">
                                    Safe from Extermination for: <CountdownComponent useBy={exterminationTimer}/>
                                </div>
                            )}

                            {effects.flatMap(({ tileId, effect, tileIndex }) =>
                                Object.keys(effect).map(effectKey => (
                                    <div className="inventory-list-text" key={`${tileId}-${effectKey}`}>
                                        Tile {tileIndex + 1}: {addSpaceToCamelCase(effectKey)}
                                    </div>
                                ))
                            )}

                            {effects.length === 0 && (
                                    <div className="inventory-list-text">No current status effects</div>
                            )}
                        </div>
                    </div>
                </CollapsibleSection>
            </div>
        </div>
        </>
    )
}