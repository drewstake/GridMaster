import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinGame, makeMove, restartGame } from "../gameUtils";
import '../App.css'; // Import App.css for styles

const GridMaster = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    board: Array(9).fill(null),
    xIsNext: true,
    xMoves: [],
    oMoves: [],
    gameOver: false,
    winner: null,
    winningLine: null,
    highlightedSquares: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    console.log("Joining game with ID:", gameId);
    joinGame(gameId, (data) => {
      console.log("Received game data:", data);
      if (data.error) {
        setGameState((prevState) => ({
          ...prevState,
          error: data.error,
          loading: false,
        }));
      } else {
        setGameState((prevState) => {
          const newState = {
            ...prevState,
            board: Array.isArray(data.board) ? data.board : Array(9).fill(null),
            xIsNext: typeof data.xIsNext === 'boolean' ? data.xIsNext : true,
            xMoves: Array.isArray(data.xMoves) ? data.xMoves : [],
            oMoves: Array.isArray(data.oMoves) ? data.oMoves : [],
            gameOver: typeof data.gameOver === 'boolean' ? data.gameOver : false,
            winner: data.winner || null,
            winningLine: data.winningLine || null,
            highlightedSquares: data.highlightedSquares || [],
            loading: false,
          };
          console.log("Updated game state:", newState);
          return newState;
        });
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
        console.log("Winner found:", board[a], "Line:", lines[i]);
        return { player: board[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleClick = (i) => {
    console.log("Square clicked:", i);
    setGameState((prevState) => {
      if (prevState.gameOver || prevState.board[i]) {
        console.log("Invalid move. Game over or square already filled.");
        return prevState;
      }

      const newBoard = [...prevState.board];
      const newMoves = prevState.xIsNext ? [...prevState.xMoves] : [...prevState.oMoves];

      if (newMoves.length === 3) {
        const removedSquare = newMoves.shift();
        console.log("Removing piece from square:", removedSquare);
        newBoard[removedSquare] = null;
      }

      newBoard[i] = prevState.xIsNext ? "X" : "O";
      newMoves.push(i);

      const winnerInfo = calculateWinner(newBoard);
      const gameOver = winnerInfo !== null;
      const highlightedSquares = gameOver
        ? winnerInfo.line
        : newMoves.length === 3 ? [newMoves[0]] : [];

      const updatedState = {
        board: newBoard,
        xIsNext: !prevState.xIsNext,
        xMoves: prevState.xIsNext ? newMoves : prevState.xMoves,
        oMoves: !prevState.xIsNext ? newMoves : prevState.oMoves,
        gameOver,
        winner: winnerInfo ? winnerInfo.player : null,
        winningLine: winnerInfo ? winnerInfo.line : null,
        highlightedSquares,
      };

      console.log("Updated state after move:", updatedState);
      makeMove(gameId, updatedState);

      return updatedState;
    });
  };

  const handleRestartGame = () => {
    console.log("Restarting game");
    restartGame(gameId);
  };

  const handleBack = () => {
    navigate('/');
  };

  const renderSquare = (value, i) => {
    const isWinningSquare = gameState.winningLine && gameState.winningLine.includes(i);
    const isRemovingSquare = 
      (gameState.xIsNext && gameState.xMoves.length === 3 && gameState.xMoves[0] === i) ||
      (!gameState.xIsNext && gameState.oMoves.length === 3 && gameState.oMoves[0] === i);

    const classNames = [
      "square",
      value,
      isWinningSquare ? "highlight" : "",
      isRemovingSquare ? "remove-highlight" : ""
    ].filter(Boolean).join(" ");
    
    console.log(`Square ${i}: value=${value}, isWinningSquare=${isWinningSquare}, isRemovingSquare=${isRemovingSquare}, classNames=${classNames}`);
    
    return (
      <button
        key={i}
        onClick={() => handleClick(i)}
        className={classNames}
        data-winning={isWinningSquare}
        data-removing={isRemovingSquare}
      >
        {value}
      </button>
    );
  };

  useEffect(() => {
    console.log("Current game state:", gameState);
  }, [gameState]);

  if (gameState.loading) return <div>Loading...</div>;
  if (gameState.error) return <div>{gameState.error}</div>;

  return (
    <div className="App">
      <button onClick={handleBack} className="back-button">Back</button>
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