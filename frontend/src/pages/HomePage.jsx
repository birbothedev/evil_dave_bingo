import { SmallBingoBoard } from "../components/SmallBingoBoard"
import "../css/HomePage.css"
import { Legend } from "../components/util/Legend"
import { CollapsibleSection } from "../components/util/Collapsible"
import { useAllTeamsFetch } from "../components/util/contexts/FetchAllTeamsContext"
import { getNews } from "../services/api"
import { CountdownComponent } from "../components/util/Timers/CountdownComponent"

export function HomePage(){

    const { teams, loading, error } = useAllTeamsFetch()
    const { news = [] } = getNews()

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!teams) return <div>no team dummy</div>

    const actionFeed = news.map((item) => ({
        postId: item.id,
        content: item.content,
        timestamp: item.timeStamp
    }))

    return (
        <div className="home-page">
            <h2 className="page-title">EVIL DAVE'S TOTALLY EVIL BINGO EVENT</h2>
            <div className="actionfeed-and-mission-wrapper">
                <div className="action-feed-wrapper">
                    <CollapsibleSection className="action-feed-dropdown" label={"Action Feed"}>
                        <div className="inner-description">
                            { actionFeed.length > 0 ? 
                                actionFeed.map(({postId, content, timeStamp}) => 
                                    <div className="time-remaining" key={postId}>
                                        <CountdownComponent useBy={timeStamp} /> {content}
                                    </div>
                            ) : <div className="inner-description">No action feed items</div>
                        }
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
            <div className="everything-else">
                <Legend />
                <div className="bingo-container">
                    {Object.entries(teams).map(([teamKey, teamData]) => (
                        <div className="team-group" key={teamKey}
                        >
                            <SmallBingoBoard team={teamData} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}