import { InventoryBox } from "../components/InventoryBox"
import { SmallBingoBoard } from "../components/SmallBingoBoard"
import { StatusEffectBox } from "../components/StatusEffectBox"
import "../css/TeamPage.css"

export function TeamPage({team}){
    team = "Team A"

    // waiting to do this page until we have user authentication in place

    // const { teams, loading, error } = useTeamFetch();
    // if (loading) return <div>Loading Teams...</div>
    // if (error) return <div>{error}</div>

    return (
        <>
        <div className="team-page-wrapper">
            <h3 className="page-title">THIS IS TEAM {team}'s HOME PAGE</h3>
            <div className="team-columns">
                <div className="team-bingo-board">
                    <SmallBingoBoard team={team}/>
                </div>
                <div className="team-inventory-container">
                    <div className="inventory-box">
                        <InventoryBox team={team}/>
                        this is the inventory box
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