import "../css/componentcss/PlayerInfoBoxes.css"

export function StatusEffectBox({team}) {

    const effects = [];

    for (const [key, value] of Object.entries(team.teamStatusEffects)){
        if (value > 0){
            effects.push({type: key, count: value})
        }
    }

    return (
        <>
        <div className="team-info-box-wrapper">
            <div className="team-info-box">
                <h3 className="team-info-title">{team.name} STATUS EFFECTS</h3>
                <div className="inventory-items">
                    {effects.length > 0 ? (
                        <div className="inventory-list-text">
                            {effects.map((item) => (
                                <h3 className="inventory-list-text" key={item.type}>
                                    {item.type}: {item.count}
                                </h3>
                            ))}
                        </div>
                    ) : (
                        <h3 className="inventory-list-text">No current status effects</h3>
                        
                    )}
                </div>
            </div>
        </div>
        </>
    )
}