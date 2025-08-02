import { BingoBoard } from "../components/BingoBoard"
import "../css/TeamPage.css"

export function TeamPage(){
    return (
        <>
        <div className="team-page-wrapper">
            <h3>This is the team page</h3>
            <div className="team-columns">
                <div className="inventory-container">
                    <div className="team-info-box">
                        <p>this is the inventory box</p>
                    </div>
                    <div className="team-info-box">
                        <p>this is the status effect box</p>
                    </div>
                </div>
                <div className="team-bingo-board">
                    <BingoBoard />
                </div>
            </div>
        </div>
        </>
    )
}