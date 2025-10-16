import "../css/componentcss/PlayerInfoBoxes.css"
import { fetchTeamData } from "./util/contexts/TeamContext"
import { CollapsibleSection } from "./util/Collapsible"
import { addSpaceToCamelCase } from "./util/AddSpaceCamelCase"
import { CountdownComponent } from "./util/Timers/CountdownComponent"

export function StatusEffectBox({ team: teamProp }) {
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

    const tiles = team?.board?.tiles || []
    const effects = tiles.map(tile => ({
        tileId: tile.tileId,
        tileIndex: tile.index,
        effect: Object.fromEntries(
            Object.entries(tile.data.effect || {}).filter(([key, value]) => value === true)
        )
    })).filter(tile => Object.keys(tile.effect).length > 0)

    const now = Date.now() / 1000;
    const exterminationTimer = team?.lastExtermination
    const secondsLeft = Math.max(0, Math.floor(exterminationTimer - now))

    return (
        <>
        <div className="team-info-box-wrapper">
            <div className="team-status-box">
                <CollapsibleSection label={`Status Effects`}>
                        <div className="status-list-text">
                            {secondsLeft > 0 && (
                                <div className="time-remaining">
                                {`• Safe from Extermination (`}<CountdownComponent useBy={exterminationTimer}/>{`)`}
                                </div>
                            )}

                            {effects.flatMap(({ tileId, effect, tileIndex }) =>
                                Object.keys(effect).map(effectKey => (
                                    <div className="status-list-text" key={`${tileId}-${effectKey}`}>
                                        • Tile {tileIndex}: {addSpaceToCamelCase(effectKey)}
                                    </div>
                                ))
                            )}

                            {effects.length === 0 && (
                                    <div className="status-list-text">No current status effects</div>
                            )}
                        </div>
                </CollapsibleSection>
            </div>
        </div>
        </>
    )
}