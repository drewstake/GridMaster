import React, { useState } from "react";
import { createGame, generateInviteLink } from "../gameUtils";
import GridMaster from "./GridMaster";

const Home = () => {
  const [inviteLink, setInviteLink] = useState("");
  const [gameId, setGameId] = useState(null);

  const handleCreateGame = async () => {
    console.log("Create Game button clicked");
    try {
      const newGameId = await createGame();
      const link = generateInviteLink(newGameId);
      console.log("Game created with ID:", newGameId);
      setInviteLink(link);
      setGameId(newGameId);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  return (
    <div className="App">
      <h1>Welcome to GridMaster!</h1>
      <button onClick={handleCreateGame}>Create Game</button>
      {inviteLink && (
        <div>
          <p>Share this link with your friend:</p>
          <a href={inviteLink}>{inviteLink}</a>
        </div>
      )}
      {gameId && <GridMaster gameId={gameId} />}
    </div>
  );
};

export default Home;