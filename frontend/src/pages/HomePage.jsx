import { SmallBingoBoard } from "../components/SmallBingoBoard"
import "../css/HomePage.css"
import { Legend } from "../components/util/Legend"
import { CollapsibleSection } from "../components/util/Collapsible"
import { useAllTeamsFetch } from "../components/util/contexts/FetchAllTeamsContext"

export function HomePage(){

    const { teams, loading, error } = useAllTeamsFetch()

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!teams) return <div>no team dummy</div>


    const timeStamp = "00:00:00"

    const teamArray = Array.isArray(teams) ? teams : [teams]

        console.log(teams?.team?.board?.tiles.length);


    // action feed: for every new action add a new child (timestamp + text)

    return (
        <div className="home-page">
            <h2 className="page-title">EVIL DAVE'S TOTALLY EVIL BINGO EVENT</h2>
            <div className="actionfeed-and-mission-wrapper">
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
                    {Object.entries(teams).map(([teamKey, teamData]) => (
                        <div className="team-group" key={teamKey}>
                            <SmallBingoBoard team={teamData} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}