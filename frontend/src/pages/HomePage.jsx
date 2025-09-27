import { SmallBingoBoard } from "../components/SmallBingoBoard"
import "../css/HomePage.css"
import { BonusMissionComponent } from "../components/BonusMissionComponent"
import { Legend } from "../components/util/Legend"
import { CollapsibleSection } from "../components/util/Collapsible"
import { fetchTeamData } from "../components/util/TeamContext"

export function HomePage(){

    const { teams, loading, error } = fetchTeamData()

    if (loading) return <div>Loading Teams...</div>
    if (error) return <div>{error}</div>

    const timeStamp = "00:00:00"

    // action feed: for every new action add a new child (timestamp + text)

    return (
        <div className="home-page">
            <h2 className="page-title">EVIL DAVE'S TOTALLY EVIL BINGO EVENT</h2>
            <div className="actionfeed-and-mission-wrapper">
                <div className="bonus-missions-home-page">
                    <BonusMissionComponent page={"home"}/>
                </div>
                <div className="action-feed-wrapper">
                    <CollapsibleSection className="action-feed-dropdown" label={"Action Feed"}>
                        <div className="inner-description">
                            {timeStamp} this is going to be the stored actions
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
            <div className="everything-else">
                <Legend />
                <div className="bingo-container">
                    <div className="team-groups">
                        <SmallBingoBoard/>
                    </div>
                </div>
            </div>
        </div>
    )
}