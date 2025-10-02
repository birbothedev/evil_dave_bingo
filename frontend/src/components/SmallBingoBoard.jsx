import "../css/componentcss/SmallBoard.css"
import { useState } from "react"
import { TeamPoints } from "./TeamPoints"
import { fetchTeamData } from "./util/contexts/TeamContext"

export function SmallBingoBoard({ team: teamProp }){
    const [isOpen, setIsOpen] = useState(false)

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
    if (!team?.board) return <div>No board data found.</div>

    const boardTiles = team?.board?.tiles?.map(tile => ({
        tileId: tile.tileId,
        tileIndex: tile.index,
        tileDescription: tile.data.descriptor,
        tileObtained: tile.data.obtained,
        tileRequired: tile.data.required,
        // tileProtection: tile.data.effect.protected,
        // tileExtermination: tile.data.effect.exterminated,
        // tileReclaimed: tile.data.effect.reclaimed
    }))

    console.log(boardTiles)

    return (
        <>
        <div className="small-board-page">
            <div className="board-label-group">
                <h3 className="board-title">{team.name}</h3>
                <div className="points-title"><TeamPoints team={team}/></div>
            </div>
            <div 
                className={isOpen ? "big-bingo-board" : "small-bingo-board"}
                onClick={() => {
                    if (window.innerWidth > 1400) {
                    setIsOpen((prev) => !prev)
                    }
                }}
                >
                <div className={isOpen ? "big-tiles-container" : "small-tiles-container"}>
                    {boardTiles.map(({ tileId, tileIndex, tileDescription, 
                        tileExtermination, tileProtection, tileObtained, tileRequired, tileReclaimed }) => {
                        return (
                            <div
                                className={isOpen ? "big-tiles" : "small-tiles"}
                                key={`${tileId}-${tileIndex}`}
                                style={{
                                    backgroundColor: tileProtection
                                        ? "#026975"
                                        : tileReclaimed
                                        ? "#026975"
                                        : tileExtermination
                                        ? "#754702"
                                        : (tileObtained == tileRequired && tileObtained > 0)
                                        ? "#750D02"
                                        : undefined
                                }}
                            >
                                {isOpen ? tileDescription : tileIndex + 1}
                            </div>
                        );
                    })}
                </div>
            </div> 
        </div>
        </>
    )
}