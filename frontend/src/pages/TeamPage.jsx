import { BingoBoard } from "../components/BingoBoard"
import { InventoryBox } from "../components/InventoryBox"
import { StatusEffectBox } from "../components/StatusEffectBox"
import { TeamPoints } from "../components/TeamPoints"
import "../css/TeamPage.css"

export function TeamPage({team}){

    team = "Team A"

    return (
        <>
        <div className="team-page-wrapper">
            <h3 className="page-title">THIS IS TEAM {team}'s HOME PAGE</h3>
            <div className="team-columns">
                <div className="team-inventory-container">
                    <div className="inventory-box">
                        <InventoryBox team={team}/>
                    </div>
                    <div className="status-box">
                        <StatusEffectBox team={team}/>
                    </div>
                    <div className="points-box">
                        <TeamPoints team={team}/>
                    </div>
                </div>
                <div className="team-bingo-board">
                    <BingoBoard team={team}/>
                </div>
            </div>
        </div>
        </>
    )
}