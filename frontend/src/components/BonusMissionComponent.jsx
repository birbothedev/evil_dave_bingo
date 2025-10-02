
import "../css/componentcss/BonusMission.css"
import { CollapsibleSection } from "./util/Collapsible"
import { fetchTeamData } from "./util/contexts/TeamContext"
import { CountdownComponent } from "./util/Timers/CountdownComponent"

export function BonusMissionComponent({page}) {
    const { team, loading, error } = fetchTeamData()

    if (loading) return <div>Loading Team...</div>
    if (error) return <div>{error}</div>
    if (!team) return <div>No team data found.</div>

    const missions = team.board.missions

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
                                    style={(isCompleted && page==="team") ? { textDecoration: "line-through" } : {}}
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