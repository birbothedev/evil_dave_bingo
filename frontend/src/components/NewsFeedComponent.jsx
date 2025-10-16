import { useEffect } from "react"
import { getNews } from "../services/api"
import { useState } from "react"
import { CollapsibleSection } from "./util/Collapsible"
import { CountdownComponent } from "./util/Timers/CountdownComponent"


export function NewsFeed(){
    const [news, setNews] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchNews(){
            try {
                const data = await getNews()
                setNews(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchNews()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    // if (!news || news.length === 0) return <div>No action feed items</div>

    console.log(news)

    const actionFeed = news.map(item => ({
        postId: item.postId,
        content: item.content,
        timestamp: item.timestamp
    }))


    return (
        <div className="action-feed-wrapper">
            <CollapsibleSection className="action-feed-dropdown" label={"Action Feed"}>
                <div className="inner-description">
                    { actionFeed.length > 0 ? 
                        actionFeed.map(({postId, content, timestamp}) => 
                            <div className="action-feed-item-wrapper" key={postId}>
                                <div className="time-remaining">
                                    <CountdownComponent useBy={timestamp} component={"news"} />{" "}
                                    {content}
                                </div>
                            </div>
                    ) : <div className="inner-description">No action feed items</div>
                }
                </div>
            </CollapsibleSection>
        </div>
    )

}