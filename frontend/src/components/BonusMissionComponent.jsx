import "../css/componentcss/BonusMission.css"

export function BonusMissionComponent() {

    return (
        <>
        <div className="bonus-mission-container">
            <div className="bonus-mission-description-container">
                <h3 className="bonus-mission-title">Active Bonus Missions</h3>
                <h3 className="bonus-mission-description">This is a description of the bonus mission</h3>
            </div>
            <div className="bonus-mission-reward-container">
                <h3 className="bonus-mission-title">Rewards</h3>
                <h3 className="bonus-mission-reward">This is the Reward</h3>
            </div>
        </div>
        </>
    )
}