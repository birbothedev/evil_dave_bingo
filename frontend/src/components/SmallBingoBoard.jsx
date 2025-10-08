import "../css/componentcss/SmallBoard.css"
import { useState } from "react"
import { TeamPoints } from "./TeamPoints"
import { fetchTeamData } from "./util/contexts/TeamContext"

export function SmallBingoBoard({ team: teamProp, canOpen, page }){
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
        tileIndex: tile.index,
        tileDescription: tile.data.descriptor,
        tileObtained: tile.data.obtained,
        tileRequired: tile.data.required,
        tileProtection: tile.data?.effect?.protected,
        tileExtermination: tile.data?.effect?.exterminated,
        tileReclaimed: tile.data?.effect?.reclaimed
    }))

    const now = Date.now() / 1000;
    const exterminationTimer = team?.lastExtermination
    const secondsLeft = Math.max(0, Math.floor(exterminationTimer - now))

    const cols = 7
    const rows = 7
    const reorderedTiles = []

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const index = row * cols + col
            if (index < boardTiles.length) {
                reorderedTiles.push({
                    ...boardTiles[index],
                    tileIndex: index 
                })
            }
        }
    }

    return (
        <div className="small-board-page">
            <div className="board-label-group">
                <h3 className="board-title">{team.name}</h3>
                <div className="points-title"><TeamPoints team={team}/></div>
            </div>
            <div 
                className={isOpen ? "big-bingo-board" : "small-bingo-board"}
                style={{
                    backgroundColor: (secondsLeft > 0) ? "#026975" : undefined
                }}
                onClick={() => {
                    if (canOpen && window.innerWidth > 1190) {
                    setIsOpen((prev) => !prev)
                    }
                }}
                >
                <div 
                className={isOpen ? "big-tiles-container" : "small-tiles-container"}
                    style={{
                        backgroundColor: (secondsLeft > 0) ? "#026975" : undefined
                    }}
                >
                    {reorderedTiles.map((tile, displayIndex) => {
                        return (
                            <div
                                className={isOpen ? "big-tiles" : "small-tiles"}
                                key={`${tile.tileIndex}-${tile.tileDescription}`}
                                style={{
                                    backgroundColor: tile.tileProtection
                                        ? "#013F46"
                                        : tile.tileReclaimed
                                        ? "#013F46"
                                        : tile.tileExtermination
                                        ? "#754702"
                                        : (tile.tileObtained === tile.tileRequired && tile.tileObtained > 0)
                                        ? "#750D02"
                                        : (tile.tileObtained > 0 && tile.tileObtained !== tile.tileRequired && 
                                            (page === "team" || page === "admin") )
                                        ? "#F2492A"
                                        : undefined
                                }}
                            >
                                {isOpen ? tile.tileDescription : tile.tileIndex}
                            </div>
                        )
                    })}
                </div>
            </div> 
        </div>
    )
}