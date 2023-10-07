const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const currentPlayerId = "player1";

function createGame() {
  const state = {
    players: {
      player1: { y: 1, x: 1 },
      player2: { y: 3, x: 9 },
    },
    fruits: {
      fruit1: { y: 1, x: 3 },
    },
  };
  function movePlayer(command) {
    console.log(`Moving ${command.playerId} with ${command.keyPressed}`);

    const keyPressed = command.keyPressed;
    const player = state.players.player1;

    if ((keyPressed === "ArrowUp" || keyPressed === "z") && player.y > 0) {
      player.y--;
      return;
    }

    if (keyPressed === "ArrowDown" && player.y < 9) {
      player.y++;
      return;
    }
    if (keyPressed === "ArrowRight" && player.x < 9) {
      player.x++;
      return;
    }

    if (keyPressed === "ArrowLeft" && player.x > 0) {
      player.x--;
      return;
    }
  }
  return { movePlayer, state };
}

const game = createGame();

const keyboardListener = createKeyboardListener();
keyboardListener.subscribe(game.movePlayer);

function createKeyboardListener() {
  const state = {
    observers: [],
  };

  function subscribe(observersFunction) {
    state.observers.push(observersFunction);
  }

  function notifyAll(command) {
    console.log(`Notifying ${state.observers.length} observers`);
    for (const observersFunction of state.observers) {
      observersFunction(command);
    }
  }

  document.addEventListener("keydown", handleKeyDown);

  function handleKeyDown(e) {
    const keyPressed = e.key;

    const command = {
      playerId: "player1",
      keyPressed,
    };

    notifyAll(command);
  }

  return {
    subscribe,
  };
}

renderScreen();

function renderScreen() {
  ctx.fillStyle = "white";
  ctx.clearRect(0, 0, 10, 10);

  for (const playerId in game.state.players) {
    const player = game.state.players[playerId];
    ctx.fillStyle = "black";
    ctx.fillRect(player.x, player.y, 1, 1);
  }

  for (const fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId];
    ctx.fillStyle = "green";
    ctx.fillRect(fruit.x, fruit.y, 1, 1);
  }

  requestAnimationFrame(renderScreen);
}
