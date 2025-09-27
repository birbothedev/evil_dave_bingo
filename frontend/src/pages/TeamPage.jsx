import { InventoryBox } from "../components/InventoryBox"
import { SmallBingoBoard } from "../components/SmallBingoBoard"
import { StatusEffectBox } from "../components/StatusEffectBox"
import { BonusMissionComponent } from "../components/BonusMissionComponent"
import { useLocation } from "react-router-dom"
import "../css/TeamPage.css"
import { Legend } from "../components/util/Legend"
import { fetchTeamData } from "../components/util/TeamContext"

export function TeamPage(){
    const location = useLocation();
    // const { team } = location.state || {}; // fallback in case state is undefined

    const { team, loading, error } = fetchTeamData()

    if (loading) return <div>Loading Team...</div>
    if (error) return <div>{error}</div>
    if (!team?.board) return <div>No board data found.</div>

    if (!team) return <div>No team data!</div>;

    return (
        <div className="team-page-wrapper">
            <h3 className="page-title">{team.name} Home Page</h3>
            <div className="actionfeed-and-mission-wrapper-team-page">
                <div className="bonus-missions-home-page">
                    <BonusMissionComponent />
                </div>
            </div>
            <div className="everything-else-team-page">
                <Legend />
                <div className="team-columns">
                    <div className="team-bingo-board">
                        <SmallBingoBoard/>
                    </div>
                    <div className="team-inventory-container">
                        <div className="inventory-box">
                            <InventoryBox/>
                        </div>
                        <div className="status-box">
                            <StatusEffectBox/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}