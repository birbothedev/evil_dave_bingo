import { useState } from "react";
import "../css/componentcss/BonusMission.css"
import { useParams } from "react-router-dom";
import { CollapsibleSection } from "./util/Collapsible";

export function BonusMissionComponent() {
    const { page } = useParams();
    const [isOpen, setIsOpen] = useState(false)

    const reward = "This is the reward"

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
                <CollapsibleSection 
                    label={"This is a description of a bonus mission"}
                    children={`Reward: ${reward}`}
                />
                {/* <h3 className="bonus-mission-description">This is a description of the bonus mission</h3> */}
            </div>
        </div>
        </>
    )
}