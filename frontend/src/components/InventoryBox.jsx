import "../css/componentcss/PlayerInfoBoxes.css"

export function InventoryBox({team}) {

    if (!team || !team.inventoryCount) {
        console.warn("Missing inventoryCount for team:", team);
        return null;
    }

    const inventory = [];

    for (const [key, value] of Object.entries(team.inventoryCount)){
        if (value > 0){
            inventory.push({type: key, count: value})
        }
    }
    
    return (
        <>
        <div className="team-info-box-wrapper">
            <div className="team-info-box">
                <h3 className="team-info-title">This is the inventory box for {team.name}</h3>
                <div className="inventory-items">
                    {inventory.length > 0 ? (
                        <div className="inventory-list-text">
                            {inventory.map((item) => (
                                <h3 className="inventory-list-text" key={item.type}>
                                    {item.type}: {item.count}
                                </h3>
                            ))}
                        </div>
                    ) : (
                        <h3 className="inventory-list-text">No items in inventory</h3>
                        
                    )}
                </div>
            </div>
        </div>
        </>
    )
}