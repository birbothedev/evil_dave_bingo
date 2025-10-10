import "../css/componentcss/BonusMission.css"
import { CollapsibleSection } from "./util/Collapsible"
import { CountdownComponent } from "./util/Timers/CountdownComponent"

export function BonusMissionComponent({page, team}) {

    const missions = team.board.missions
    const now = Date.now() / 1000
    const activeMissions = missions.filter(m => m.completeBefore > now)

    return (
        <>
        <div className="bonus-mission-container">
            <div className="bonus-mission-description-container">
            <CollapsibleSection label="Active Bonus Missions">
                {activeMissions.length > 0 &&
                    activeMissions.map((mission, missionId) => {
                        const isCompleted = mission.completed

                        return (
                            <CollapsibleSection
                            key={missionId}
                            label={
                                <div
                                    className="inventory-list-text"
                                    style={(isCompleted && (page==="team" || page==="admin")) ? { textDecoration: "line-through" } : {}}
                                >
                                    <CountdownComponent useBy={mission.completeBefore} component={"bonus mission"}/>{" "}
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