import "../css/componentcss/SmallBoard.css"
import { useState } from "react"
import { TeamPoints } from "./TeamPoints";

export function SmallBingoBoard({team}){
    // start with open state being set to false
    const [isOpen, setIsOpen] = useState(false);

    const numRows = 7;
    const numCols = 7;
    let tileCount = 0;
    const tiles = [];


    //this logic going to have to change once we pull actual data
    for (let i = 1; i <= numRows; i++) {
        for (let j = 1; j <= numCols; j++) {
            tileCount++
            const tileId = `tile${(i - 1) * numCols + j}`;
            tiles.push(
                <div
                    className={isOpen ? "big-tiles" : "small-tiles"}
                    id={tileId}
                    key= {tileCount}
                    data-x={i}
                    data-y={j}
                >
                    {isOpen ? 
                        <p>tile description text</p> : tileCount
                    }
                </div>
            );
        }
    }


    return (
        <>
        <div className="small-board-page">
            <div className="board-label-group">
                <h3 className="team-title board-title">{team.name}</h3>
                <div className="points-title"><TeamPoints team = {team}/></div>
            </div>
            <div 
                className={isOpen ? "big-bingo-board" : "small-bingo-board"}
                onClick={() => setIsOpen((prev) => !prev)}
                >
                <div 
                    className={isOpen ? "big-tiles-container" : "small-tiles-container"}
                >
                    {tiles}
                </div>
            </div> 
        </div>
        </>
    )
}