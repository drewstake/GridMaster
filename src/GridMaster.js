import React, { useState, useEffect } from 'react';

const GridMaster = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [xMoves, setXMoves] = useState([]);
  const [oMoves, setOMoves] = useState([]);
  const [highlightedSquares, setHighlightedSquares] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setHighlightedSquares(winner.line);
      setGameOver(true);
    } else if (xIsNext && xMoves.length === 3) {
      setHighlightedSquares([xMoves[0]]);
    } else if (!xIsNext && oMoves.length === 3) {
      setHighlightedSquares([oMoves[0]]);
    } else {
      setHighlightedSquares([]);
    }
  }, [board, xMoves, oMoves, xIsNext]);

  const handleClick = (i) => {
    if (gameOver || board[i] || (highlightedSquares.length === 1 && highlightedSquares[0] === i)) return;

    const newBoard = [...board];
    let newMoves;

    if (xIsNext) {
      newMoves = [...xMoves];
      if (newMoves.length === 3) {
        newBoard[newMoves.shift()] = null;
      }
      newBoard[i] = 'X';
      newMoves.push(i);
      setXMoves(newMoves);
    } else {
      newMoves = [...oMoves];
      if (newMoves.length === 3) {
        newBoard[newMoves.shift()] = null;
      }
      newBoard[i] = 'O';
      newMoves.push(i);
      setOMoves(newMoves);
    }
    
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const renderSquare = (i) => {
    const isHighlighted = highlightedSquares.includes(i);
    const squareClass = `w-20 h-20 text-4xl font-bold flex items-center justify-center
      ${isHighlighted ? 'bg-yellow-200' : 'bg-white'}
      ${(isHighlighted && !gameOver) || gameOver ? 'cursor-not-allowed' : 'cursor-pointer'}
      border border-gray-300`;

    return (
      <button 
        className={squareClass}
        onClick={() => handleClick(i)}
        disabled={(isHighlighted && !gameOver) || gameOver}
        key={i}
      >
        {board[i]}
      </button>
    );
  };

  const winner = calculateWinner(board);
  let status;
  if (winner) {
    status = `Winner: ${winner.player}`;
  } else if (board.every(square => square)) {
    status = 'Draw';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="App">
      <h2 className="mb-4">{status}</h2>
      <div className="grid">
        {[0, 1, 2].map(row => (
          <React.Fragment key={row}>
            {[0, 1, 2].map(col => (
              <React.Fragment key={col}>
                {renderSquare(row * 3 + col)}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default GridMaster;