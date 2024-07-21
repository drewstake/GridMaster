import React, { useState } from "react";
import { createGame, generateInviteLink } from "../gameUtils";

const Home = () => {
  const [inviteLink, setInviteLink] = useState("");

  const handleCreateGame = async () => {
    console.log("Create Game button clicked");
    try {
      const gameId = await createGame();
      const link = generateInviteLink(gameId);
      console.log("Game created with ID:", gameId);
      setInviteLink(link);
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
    </div>
  );
};

export default Home;