import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import createGame from "./public/game.js";

const app = express();
const server = createServer(app);
const sockets = new Server(server);
const port = 3000;

app.use(express.static("public"));

const game = createGame();
game.addPlayer({ playerId: "player1", playerX: 0, playerY: 0 });
game.addPlayer({ playerId: "player2", playerX: 5, playerY: 5 });
game.addPlayer({ playerId: "player3", playerX: 6, playerY: 3 });
game.addFruit({ fruitId: "fruit1", fruitX: 3, fruitY: 3 });
game.addFruit({ fruitId: "fruit2", fruitX: 4, fruitY: 8 });
game.movePlayer({ playerId: "player1", keyPressed: "ArrowRight" });
console.log(game.state);

sockets.on("connection", (socket) => {
  const playId = socket.id;
  console.log(`> PLayer connected on Server with id: ${playId}`);
});

app.listen(port, () => {
  console.log(`Server listening in port ${port}`);
});
