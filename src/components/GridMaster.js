import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { joinGame, makeMove, restartGame } from "../gameUtils";

const GridMaster = () => {
  const { gameId } = useParams();
  const [gameState, setGameState] = useState({
    board: Array(9).fill(null),
    xIsNext: true,
    xMoves: [],
    oMoves: [],
    gameOver: false,
    winner: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    joinGame(gameId, (data) => {
      if (data.error) {
        setGameState((prevState) => ({
          ...prevState,
          error: data.error,
          loading: false,
        }));
      } else {
        setGameState((prevState) => ({
          ...prevState,
          board: Array.isArray(data.board) ? data.board : Array(9).fill(null),
          xIsNext: typeof data.xIsNext === 'boolean' ? data.xIsNext : true,
          xMoves: Array.isArray(data.xMoves) ? data.xMoves : [],
          oMoves: Array.isArray(data.oMoves) ? data.oMoves : [],
          gameOver: typeof data.gameOver === 'boolean' ? data.gameOver : false,
          winner: data.winner || null,
          loading: false,
        }));
      }
    });
  }, [gameId]);

  const calculateWinner = (board) => {
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { player: board[a], line: [a, b, c] };
      }
    }
    return null;
  };

  const handleClick = (i) => {
    setGameState((prevState) => {
      if (prevState.gameOver || prevState.board[i]) return prevState;

      const newBoard = [...prevState.board];
      const newMoves = prevState.xIsNext ? [...prevState.xMoves] : [...prevState.oMoves];

      if (newMoves.length === 3) {
        newBoard[newMoves.shift()] = null;
      }

      newBoard[i] = prevState.xIsNext ? "X" : "O";
      newMoves.push(i);

      const winner = calculateWinner(newBoard);
      const gameOver = winner !== null;

      const updatedState = {
        board: newBoard,
        xIsNext: !prevState.xIsNext,
        xMoves: prevState.xIsNext ? newMoves : prevState.xMoves,
        oMoves: !prevState.xIsNext ? newMoves : prevState.oMoves,
        gameOver,
        winner: winner ? winner.player : null,
      };

      makeMove(gameId, updatedState);

      return updatedState;
    });
  };

  const handleRestartGame = () => {
    restartGame(gameId);
  };

  const renderSquare = (value, i) => {
    const isWinningSquare =
      gameState.winner &&
      calculateWinner(gameState.board)?.line.includes(i);
    const isRemovingSquare = gameState.xIsNext
      ? gameState.xMoves.length === 3 && gameState.xMoves[0] === i
      : gameState.oMoves.length === 3 && gameState.oMoves[0] === i;
    return (
      <button
        key={i}
        onClick={() => handleClick(i)}
        className={`square ${value} ${isWinningSquare ? "highlight" : ""} ${isRemovingSquare ? "remove-highlight" : ""}`}
      >
        {value}
      </button>
    );
  };

  if (gameState.loading) return <div>Loading...</div>;
  if (gameState.error) return <div>{gameState.error}</div>;

  return (
    <div className="App">
      <h2 className="mb-4">
        {gameState.gameOver
          ? `Winner: ${gameState.winner}`
          : `Next player: ${gameState.xIsNext ? "X" : "O"}`}
      </h2>
      <div className="grid">
        {Array.isArray(gameState.board) &&
          gameState.board.map((value, i) => renderSquare(value, i))}
      </div>
      {gameState.gameOver && (
        <button onClick={handleRestartGame} className="restart-button">
          Restart Game
        </button>
      )}
    </div>
  );
};

export default GridMaster;