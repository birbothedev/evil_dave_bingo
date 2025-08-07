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
                        <ul className="inventory-list-text">
                            {inventory.map((item) => (
                                <li className="inventory-list-text" key={item.type}>
                                    {item.type}: {item.count}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No items in inventory</p>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}