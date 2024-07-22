import "./Game.css";

import React, { useEffect, useState } from "react";

import Board from "./Board";

const ws = new WebSocket("ws://localhost:8080");

const Game = () => {
  const [player, setPlayer] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [status, setStatus] = useState("");

  useEffect(() => {
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "gameCreated") {
        setGameId(data.gameId);
        setPlayer("X");
        setStatus(
          `Game created. Waiting for player to join. Game ID: ${data.gameId}`
        );
      } else if (data.type === "start") {
        setGameId(data.gameId);
        setPlayer((prevPlayer) => (prevPlayer === null ? "O" : prevPlayer));
        setStatus(`Game started. You are player ${player}.`);
        setBoard(Array(9).fill(null));
      } else if (data.type === "update") {
        setCurrentPlayer(data.currentPlayer);
        setBoard(data.board);
        setStatus(`Current player: ${data.currentPlayer}`);
      }
    };
  }, [player]);

  const createGame = () => {
    ws.send(JSON.stringify({ type: "create" }));
  };

  const joinGame = (gameId) => {
    ws.send(JSON.stringify({ type: "join", gameId }));
  };

  const makeMove = (index) => {
    if (!board[index] && player === currentPlayer) {
      ws.send(JSON.stringify({ type: "move", gameId, player, index }));
    }
  };

  return (
    <div>
      <Board board={board} onClick={makeMove} />
      <div className="controls">
        <button onClick={createGame}>Create Game</button>
        <input
          type="text"
          placeholder="Enter Game ID"
          onChange={(e) => setGameId(e.target.value)}
        />
        <button onClick={() => joinGame(gameId)}>Join Game</button>
      </div>
      <p>{status}</p>
    </div>
  );
};

export default Game;
