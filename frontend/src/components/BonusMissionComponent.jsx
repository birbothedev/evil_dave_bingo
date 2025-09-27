
import "../css/componentcss/BonusMission.css"
import { useParams } from "react-router-dom"
import { CollapsibleSection } from "./util/Collapsible"
import { fetchTeamData } from "./util/TeamContext"
import { CountdownComponent } from "./util/Timers/CountdownComponent"

export function BonusMissionComponent() {
    const { page } = useParams()
    const { team, loading, error } = fetchTeamData()

    if (loading) return <div>Loading Team...</div>
    if (error) return <div>{error}</div>
    if (!team) return <div>No team data found.</div>

    const missions = team.board.missions

    // change logic so strikethrough doesnt appear on home page

    return (
        <>
        <div className="bonus-mission-container">
            <div className="bonus-mission-description-container">
            <CollapsibleSection label="Active Bonus Missions">
                {missions.length > 0 &&
                    missions.map((mission, missionId) => {
                        const isCompleted = mission.completed

                        return (
                            <CollapsibleSection
                            key={missionId}
                            label={
                                <div
                                    className="inventory-list-text"
                                    style={isCompleted ? { textDecoration: "line-through" } : {}}
                                >
                                    <CountdownComponent useBy={mission.completeBefore} />{" "}
                                    {mission.missionTitle}
                                </div>
                            }
                            className="inner-collapsible"
                            style={{ boxShadow: "none" }}
                            >
                            <div className="inner-description">
                                • Mission: {mission.descriptor}
                            </div>
                            <div className="inner-description">
                                • Reward: {mission.reward}
                            </div>
                            </CollapsibleSection>
                        )
                    })}
                </CollapsibleSection>
            </div>
        </div>
        </>
    )
}