import { CollapsibleSection } from "../components/util/Collapsible"
import "../css/AdminPage.css"
import { InventoryBox } from "../components/InventoryBox"
import { StatusEffectBox } from "../components/StatusEffectBox"
import { useState } from "react"

export function AdminPage(){

    //placeholder teams, going to map these instead of hardcode when we have actual data
    const team1="Team1"
    const team2="Team2"
    const team3="Team3"
    const team4="Team4"
    const team5="Team5"
    const team6="Team6"

    return (
        <>
        <div className="admin-page">
            <h3>This is the admin page</h3>
            <div className="button-container">
                <div className="buttons">
                    
                    <CollapsibleSection 
                        label="Team Inventories"
                    >
                        <div className="inventory-container">
                            <InventoryBox team={team1} />
                            <InventoryBox team={team2} />
                            <InventoryBox team={team3} />
                            <InventoryBox team={team4} />
                            <InventoryBox team={team5} />
                            <InventoryBox team={team6} />
                        </div>
                    </CollapsibleSection>
                    <CollapsibleSection 
                        label="Team Status Effects"
                    >
                        <div className="status-effect-container">
                            <StatusEffectBox team={team1} />
                            <StatusEffectBox team={team2} />
                            <StatusEffectBox team={team3} />
                            <StatusEffectBox team={team4} />
                            <StatusEffectBox team={team5} />
                            <StatusEffectBox team={team6} />
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
        </div>
        </>
    )
}