const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "..", "public")));

let games = {};

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "create") {
      const gameId = Date.now().toString();
      games[gameId] = {
        players: [ws],
        board: Array(9).fill(null),
        currentPlayer: "X",
      };
      ws.send(JSON.stringify({ type: "gameCreated", gameId }));
    } else if (data.type === "join") {
      const game = games[data.gameId];
      if (game && game.players.length < 2) {
        game.players.push(ws);
        game.players.forEach((player) =>
          player.send(JSON.stringify({ type: "start", gameId: data.gameId }))
        );
      }
    } else if (data.type === "move") {
      const game = games[data.gameId];
      if (
        game &&
        game.board[data.index] === null &&
        game.currentPlayer === data.player
      ) {
        game.board[data.index] = data.player;
        game.currentPlayer = data.player === "X" ? "O" : "X";
        game.players.forEach((player) =>
          player.send(
            JSON.stringify({
              type: "update",
              board: game.board,
              currentPlayer: game.currentPlayer,
            })
          )
        );
      }
    }
  });

  ws.on("close", () => {
    for (const gameId in games) {
      const game = games[gameId];
      game.players = game.players.filter((player) => player !== ws);
      if (game.players.length === 0) {
        delete games[gameId];
      }
    }
  });
});

server.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});
