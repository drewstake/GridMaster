// src/components/Game.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { joinGame, makeMove } from "../gameUtils";

const Game = () => {
  const { gameId } = useParams();
  const [gameState, setGameState] = useState({ board: Array(9).fill(null), xIsNext: true, loading: true });

  useEffect(() => {
    joinGame(gameId, (data) => {
      setGameState({ ...data, loading: false });
    });
  }, [gameId]);

  if (gameState.loading) return <div>Loading...</div>;
  if (gameState.error) return <div>{gameState.error}</div>;

  const handleClick = (i) => {
    const board = [...gameState.board];
    if (gameState.gameOver || board[i]) return;
    
    board[i] = gameState.xIsNext ? 'X' : 'O';
    makeMove(gameId, board, !gameState.xIsNext);
  };

  return (
    <div className="App">
      <h2 className="mb-4">
        {gameState.gameOver ? `Winner: ${gameState.winner}` : `Next player: ${gameState.xIsNext ? 'X' : 'O'}`}
      </h2>
      <div className="grid">
        {gameState.board && gameState.board.map((value, i) => (
          <button key={i} onClick={() => handleClick(i)} className={`square ${value}`}>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Game;