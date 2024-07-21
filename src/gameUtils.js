import { ref, set, onValue, push } from "firebase/database";
import { database } from "./firebaseConfig"; // Adjust the path as needed

export const createGame = async () => {
  const gamesRef = ref(database, 'games');
  const newGameRef = push(gamesRef);
  const gameId = newGameRef.key;
  const initialState = {
    board: Array(9).fill(null),
    xIsNext: true,
    xMoves: [],
    oMoves: [],
    gameOver: false,
    winner: null,
  };

  await set(newGameRef, initialState);
  return gameId;
};

export const generateInviteLink = (gameId) => {
  const link = `${window.location.origin}/game/${gameId}`;
  return link;
};

export const joinGame = (gameId, callback) => {
  const gameRef = ref(database, `games/${gameId}`);
  onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    } else {
      callback({ error: "Game not found" });
    }
  });
};

export const makeMove = (gameId, gameState) => {
  const gameRef = ref(database, `games/${gameId}`);
  const cleanedGameState = {
    ...gameState,
    xIsNext: gameState.xIsNext !== undefined ? gameState.xIsNext : true,
    xMoves: Array.isArray(gameState.xMoves) ? gameState.xMoves : [],
    oMoves: Array.isArray(gameState.oMoves) ? gameState.oMoves : [],
    gameOver: gameState.gameOver !== undefined ? gameState.gameOver : false,
    winner: gameState.winner !== undefined ? gameState.winner : null,
  };

  set(gameRef, cleanedGameState);
};

export const restartGame = (gameId) => {
  const gameRef = ref(database, `games/${gameId}`);
  const initialState = {
    board: Array(9).fill(null),
    xIsNext: true,
    xMoves: [],
    oMoves: [],
    gameOver: false,
    winner: null,
  };
  set(gameRef, initialState);
};