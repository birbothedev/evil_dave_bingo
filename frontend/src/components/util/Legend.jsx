import "../../css/componentcss/Legend.css"

export function Legend({pageProp}) {
    return (
        <>
        <div className="legend-wrapper">
            <div className="legend-object">
                <img 
                    className="legend-image" 
                    src="/images/legendImages/incompleteTileColor32px.png" 
                    alt="Incomplete Tile" 
                />
                <h3 className="legend-text">Incomplete Tile</h3>
            </div>
            <div className="legend-object">
                <img 
                    className="legend-image" 
                    src="/images/legendImages/completedTileColor32px.png" 
                    alt="Completed Tile" 
                />
                <h3 className="legend-text">Complete Tile</h3>
            </div>
            <div className="legend-object">
                <img 
                    className="legend-image" 
                    src="/images/legendImages/exterminatedTileColor32px.png" 
                    alt="Exterminated Tile" 
                />
                <h3 className="legend-text">Exterminated Tile</h3>
            </div>
            <div className="legend-object">
                <img 
                    className="legend-image" 
                    src="/images/legendImages/protectedTileColor32px.png" 
                    alt="Protected Tile" 
                />
                <h3 className="legend-text">Protected Tile</h3>
            </div>
            {
                pageProp==="team" ? 
                    (
                        <div className="legend-object">
                            <img 
                                className="legend-image" 
                                src="/images/legendImages/partialTileColor32px.png" 
                                alt="Partial Tile" 
                            />
                            <h3 className="legend-text">Partial Tile</h3>
                        </div>
                    ) : 
                    undefined
            }
            
        </div>
        </>
    )
}