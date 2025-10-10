import "../css/componentcss/BonusMission.css"
import { CollapsibleSection } from "./util/Collapsible"
import { CountdownComponent } from "./util/Timers/CountdownComponent"

export function BonusMissionComponent({page, team}) {

    const missions = team.board.missions

    return (
        <>
        <div className="bonus-mission-container">
            <div className="bonus-mission-description-container">
            <CollapsibleSection label="Active Bonus Missions">
                {missions.length > 0 &&
                    missions.map((mission, missionId) => {
                        const isCompleted = mission.completed

                        const now = Date.now() / 1000;
                        const secondsLeft = Math.max(0, Math.floor(mission.completeBefore - now))
                        const isTimeRemaining = secondsLeft > 0

                        return (
                            <CollapsibleSection
                            key={missionId}
                            label={
                                <div
                                    className="inventory-list-text"
                                    style={(isCompleted && (page==="team" || page==="admin")) ? { textDecoration: "line-through" } : {}}
                                >
                                    {isTimeRemaining && 
                                        <>
                                        <CountdownComponent useBy={mission.completeBefore} />{" "}
                                        {mission.missionTitle}
                                        </>
                                    }
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