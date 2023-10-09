import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import createGame from "./public/game.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = 3000;

app.use(express.static("public"));

const game = createGame();
game.start();

game.subscribe((command) => {
  console.log(`> Emmiting ${command.type}`);
  io.emit(command.type, command);
});

io.on("connection", (socket) => {
  const playerId = socket.id;
  console.log(`A player connected on server with the id: ${playerId}`);

  game.addPlayer({ playerId: playerId });

  console.log(game.state);
  socket.emit("setup", game.state);

  socket.on("disconnect", () => {
    game.removePlayer({ playerId });
    console.log(`Player ${playerId} disconnected`);
  });

  socket.on("move-player", (command) => {
    command.playerId = playerId;
    command.type = "move-player";

    game.movePlayer(command);
  });
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${3000}`);
});
