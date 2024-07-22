import { ref, set, onValue, push } from "firebase/database";
import { database } from "./firebaseConfig";

console.log("gameUtils.js loaded");

export const createGame = async () => {
  console.log("Creating new game");
  const gamesRef = ref(database, 'games');
  const newGameRef = push(gamesRef);
  const gameId = newGameRef.key;
  console.log("New game ID:", gameId);

  const initialState = {
    board: Array(9).fill(null),
    xIsNext: true,
    xMoves: [],
    oMoves: [],
    gameOver: false,
    winner: null,
    winningLine: null,
  };

  console.log("Setting initial game state:", initialState);
  try {
    await set(newGameRef, initialState);
    console.log("Game created successfully");
    return gameId;
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
};

export const generateInviteLink = (gameId) => {
  console.log("Generating invite link for game ID:", gameId);
  const link = `${window.location.origin}/game/${gameId}`;
  console.log("Generated invite link:", link);
  return link;
};

export const joinGame = (gameId, callback) => {
  console.log("Joining game with ID:", gameId);
  const gameRef = ref(database, `games/${gameId}`);
  onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log("Game data received:", data);
      callback(data);
    } else {
      console.error("Game not found for ID:", gameId);
      callback({ error: "Game not found" });
    }
  }, (error) => {
    console.error("Error joining game:", error);
    callback({ error: "Error joining game" });
  });
};

export const makeMove = (gameId, gameState) => {
  console.log("Making move for game ID:", gameId);
  console.log("New game state:", gameState);
  const gameRef = ref(database, `games/${gameId}`);
  const cleanedGameState = {
    ...gameState,
    xIsNext: gameState.xIsNext !== undefined ? gameState.xIsNext : true,
    xMoves: Array.isArray(gameState.xMoves) ? gameState.xMoves : [],
    oMoves: Array.isArray(gameState.oMoves) ? gameState.oMoves : [],
    gameOver: gameState.gameOver !== undefined ? gameState.gameOver : false,
    winner: gameState.winner !== undefined ? gameState.winner : null,
    winningLine: Array.isArray(gameState.winningLine) ? gameState.winningLine : null,
  };

  try {
    set(gameRef, cleanedGameState);
    console.log("Move successfully made");
  } catch (error) {
    console.error("Error making move:", error);
  }
};

export const restartGame = (gameId) => {
  console.log("Restarting game with ID:", gameId);
  const gameRef = ref(database, `games/${gameId}`);
  const initialState = {
    board: Array(9).fill(null),
    xIsNext: true,
    xMoves: [],
    oMoves: [],
    gameOver: false,
    winner: null,
    winningLine: null,
  };
  try {
    set(gameRef, initialState);
    console.log("Game successfully restarted");
  } catch (error) {
    console.error("Error restarting game:", error);
  }
};