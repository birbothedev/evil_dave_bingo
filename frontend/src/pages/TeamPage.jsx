import { BingoBoard } from "../components/BingoBoard"
import { InventoryBox } from "../components/InventoryBox"
import { StatusEffectBox } from "../components/StatusEffectBox"
import "../css/TeamPage.css"

export function TeamPage({team}){
    return (
        <>
        <div className="team-page-wrapper">
            <h3>This is the team page</h3>
            <div className="team-columns">
                <div className="team-inventory-container">
                    <div className="inventory-box">
                        <InventoryBox team={team}/>
                    </div>
                    <div className="status-box">
                        <StatusEffectBox team={team}/>
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