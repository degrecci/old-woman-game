const ws = new WebSocket("ws://localhost:8080");
let player = null;
let gameId = null;

const boardElement = document.getElementById("board");
const createGameButton = document.getElementById("createGame");
const joinGameButton = document.getElementById("joinGame");
const gameIdInput = document.getElementById("gameIdInput");
const statusElement = document.getElementById("status");

createGameButton.addEventListener("click", () => {
  ws.send(JSON.stringify({ type: "create" }));
});

joinGameButton.addEventListener("click", () => {
  const gameId = gameIdInput.value;
  if (gameId) {
    ws.send(JSON.stringify({ type: "join", gameId }));
  }
});

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "gameCreated") {
    gameId = data.gameId;
    player = "X";
    statusElement.textContent = `Game created. Waiting for player to join. Game ID: ${gameId}`;
  } else if (data.type === "start") {
    gameId = data.gameId;
    player = player === null ? "O" : player;
    statusElement.textContent = `Game started. You are player ${player}.`;
    renderBoard(Array(9).fill(null));
  } else if (data.type === "update") {
    renderBoard(data.board);
    statusElement.textContent = `Current player: ${data.currentPlayer}`;
  }
};

function renderBoard(board) {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.textContent = cell;
    cellElement.addEventListener("click", () => {
      if (!cell && player === data.currentPlayer) {
        ws.send(JSON.stringify({ type: "move", gameId, player, index }));
      }
    });
    boardElement.appendChild(cellElement);
  });
}
