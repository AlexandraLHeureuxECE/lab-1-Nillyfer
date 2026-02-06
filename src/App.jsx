import { useMemo, useState } from "react";
import "./App.css";

const EMPTY = null;

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every((s) => s !== EMPTY);
}

export default function App() {
  const [squares, setSquares] = useState(Array(9).fill(EMPTY));
  const [xIsNext, setXIsNext] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);

  const result = useMemo(() => calculateWinner(squares), [squares]);
  const winner = result?.winner ?? null;
  const winningLine = result?.line ?? [];

  const isTie = !winner && isBoardFull(squares);

  const status = useMemo(() => {
    if (winner) return `Player ${winner} wins!`;
    if (isTie) return "It's a tie!";
    return `Player ${xIsNext ? "X" : "O"}'s turn`;
  }, [winner, isTie, xIsNext]);

  function handleClick(i) {
    if (winner || squares[i]) return;

    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  function restartGame() {
    setSquares(Array(9).fill(EMPTY));
    setXIsNext(true);
    setHoverIndex(null);
  }

  return (
    <div className="page">
      <h1>Tic-Tac-Toe</h1>
      <p className="status">{status}</p>

      <div className="board">
        {squares.map((value, i) => {
          const disabled = Boolean(winner) || value !== EMPTY;
          const isWinningCell = winningLine.includes(i);
          const preview =
            !disabled && hoverIndex === i ? (xIsNext ? "X" : "O") : null;

          return (
            <button
              key={i}
              className={`cell ${isWinningCell ? "win" : ""}`}
              onClick={() => handleClick(i)}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              disabled={disabled}
            >
              <span className={preview && !value ? "preview" : ""}>
                {value ?? preview ?? ""}
              </span>
            </button>
          );
        })}
      </div>

      <div className="controls">
        <button onClick={restartGame}>Restart</button>
        {(winner || isTie) && <button onClick={restartGame}>New Game</button>}
      </div>
    </div>
  );
}
