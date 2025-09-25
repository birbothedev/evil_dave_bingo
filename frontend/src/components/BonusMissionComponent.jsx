import { useState } from "react";
import "../css/componentcss/BonusMission.css"
import { useParams } from "react-router-dom";
import { CollapsibleSection } from "./util/Collapsible";

export function BonusMissionComponent() {
    const { page } = useParams();
    const [isOpen, setIsOpen] = useState(false)

    const title = "Bonus Mission Title"
    const description = "This is a description of a bonus mission"
    const reward = "This is the reward"
    const timeRemaining = "00:00:00"

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
    // for every bonus mission create new inner collapsible

    return (
        <>
        <div className="bonus-mission-container">
            <div className="bonus-mission-description-container">
                <CollapsibleSection label="Active Bonus Missions">
                    <CollapsibleSection 
                        className="inner-collapsible"
                        style={{boxShadow: "none"}}
                        label={`${timeRemaining} ${title}`}
                    >
                        <div className="inner-description">Mission: {description}</div>
                        <div className="inner-description">Reward: {reward}</div>
                    </CollapsibleSection>
                </CollapsibleSection>
            </div>
        </div>
        </>
    )
}