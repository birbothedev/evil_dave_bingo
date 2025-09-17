import "../css/componentcss/BonusMission.css"
import { useParams } from "react-router-dom";

export function BonusMissionComponent() {
    const { page } = useParams();

    // if page === team 
    //      return (
    //          bonus missions and logic to have line drawn through 
    //          completed bonus missions
    //      
    //          also have logic to make bonus missions collapsible for later
    //          in the event when its populated with loads of missions
    //      )

    // else 
    //      return (
    //          normal active bonus mission component
    //      )
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