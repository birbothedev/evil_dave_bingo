import { InventoryBox } from "../components/InventoryBox"
import { SmallBingoBoard } from "../components/SmallBingoBoard"
import { StatusEffectBox } from "../components/StatusEffectBox"
import { BonusMissionComponent } from "../components/BonusMissionComponent"
import "../css/TeamPage.css"
import { Legend } from "../components/util/Legend"
import { fetchTeamData } from "../components/util/contexts/TeamContext"
import { useNavigate } from "react-router-dom"

export function TeamPage(){
    const { team, loading, error, authorized } = fetchTeamData()
    const navigate = useNavigate()

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!team) return <div>no team dummy</div>

    return (
        <div className="team-page-wrapper">
            <h3 className="page-title"> {team.name} Home Page</h3>
            <div className="actionfeed-and-mission-wrapper-team-page">
                <div className="bonus-missions-home-page">
                    <BonusMissionComponent page={"team"}/>
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