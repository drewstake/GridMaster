// src/components/Game.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { joinGame, makeMove } from "../gameUtils";
import './App.css';

const Game = () => {
  console.log("Game component rendered");
  const { gameId } = useParams();
  console.log("Game ID from params:", gameId);
  const [gameState, setGameState] = useState({ board: Array(9).fill(null), xIsNext: true, loading: true });

  useEffect(() => {
    console.log("Game useEffect triggered");
    joinGame(gameId, (data) => {
      console.log("Received game data:", data);
      setGameState({ ...data, loading: false });
    });
  }, [gameId]);

  if (gameState.loading) {
    console.log("Game is loading");
    return <div>Loading...</div>;
  }
  if (gameState.error) {
    console.log("Game error:", gameState.error);
    return <div>{gameState.error}</div>;
  }

  const handleClick = (i) => {
    console.log("Square clicked:", i);
    const board = [...gameState.board];
    if (gameState.gameOver || board[i]) {
      console.log("Invalid move: game over or square already filled");
      return;
    }
    
    board[i] = gameState.xIsNext ? 'X' : 'O';
    console.log("Updated board:", board);
    makeMove(gameId, board, !gameState.xIsNext);
  };

  console.log("Rendering game board");
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