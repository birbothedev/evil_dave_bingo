import "../css/componentcss/BingoBoard.css";

export function BingoBoard({ team }) {
  const numRows = 6;
  const numCols = 6;
  const tiles = [];

  for (let i = 1; i <= numRows; i++) {
    for (let j = 1; j <= numCols; j++) {
      const tileId = `tile${(i - 1) * numCols + j}`;
      tiles.push(
        <div
          className="tiles"
          id={tileId}
          data-x={i}
          data-y={j}
          key={tileId}
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