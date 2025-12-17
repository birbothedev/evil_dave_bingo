import { SmallBingoBoard } from "../components/SmallBingoBoard"
import "../css/HomePage.css"
import { Legend } from "../components/util/Legend"
import { useAllTeamsFetch } from "../components/util/contexts/FetchAllTeamsContext"
import { NewsFeed } from "../components/NewsFeedComponent"

export function HomePage(){
    const { teams, loading, error } = useAllTeamsFetch()

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!teams) return <div>no team dummy</div>

    const removedTemplate = teams.filter(team => team.name != "template")

    const sortedTeams = Object.entries(removedTemplate).sort((teamA, teamB) => teamB[1].score - teamA[1].score)

    return (
        <div className="home-page">
            <h2 className="page-title">EVIL DAVE'S TOTALLY EVIL BINGO EVENT</h2>
            {/* <div className="actionfeed-and-mission-wrapper">
                <NewsFeed />
            </div> */}
            <div className="everything-else">
                <Legend pageProp={"home"}/>
                <div className="bingo-container">
                    {sortedTeams.map(([teamKey, teamData]) => (
                        <div className="team-group" key={teamKey}
                        >
                            <SmallBingoBoard team={teamData} canOpen={false} page={"home"} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}