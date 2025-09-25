// import "../css/componentcss/BingoBoard.css";

export function BingoBoard({ team }) {
    const numRows = 7;
    const numCols = 7;
    const tiles = [];
    let tilecount = 0;

    for (let i = 1; i <= numRows; i++) {
        for (let j = 1; j <= numCols; j++) {
            const tileId = `tile${(i - 1) * numCols + j}`;
            tilecount++
            tiles.push(
                <div
                className="tiles"
                key={tilecount}
                id={tileId}
                data-x={i}
                data-y={j}
                >
                {i}, {j}
                </div>,
            );
        }
    }

    return (
        <>
        <div className="team-title">{team}</div>
        <div className="bingo-board">
            <div className="tiles-container">{tiles}</div>
        </div>
        </>
    );
}