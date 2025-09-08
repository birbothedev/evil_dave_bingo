import { InventoryBox } from "../components/InventoryBox"
import { SmallBingoBoard } from "../components/SmallBingoBoard"
import { StatusEffectBox } from "../components/StatusEffectBox"
import { useTeamFetch } from "../components/util/GlobalTeamFetch";
import { BonusMissionComponent } from "../components/BonusMissionComponent";
import { useLocation } from "react-router-dom";
import "../css/TeamPage.css"


export function TeamPage(){
    const location = useLocation();
    const { team } = location.state || {}; // fallback in case state is undefined

    if (!team) return <div>No team data!</div>;

    return (
        <>
        <div className="team-page-wrapper">
            <h3 className="page-title">{team.name} HOME PAGE</h3>
            <div className="bonus-missions-home-page">
                <BonusMissionComponent />
            </div>
            <div className="team-columns">
                <div className="team-bingo-board">
                    <SmallBingoBoard team={team}/>
                </div>
                <div className="team-inventory-container">
                    <div className="inventory-box">
                        <InventoryBox team={team}/>
                    </div>
                    <div className="status-box">
                        <StatusEffectBox team={team}/>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}