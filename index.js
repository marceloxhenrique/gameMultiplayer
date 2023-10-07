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

    const acceptedMoves = {
      ArrowUp(player) {
        console.log("Moving player Up");
        if (player.y > 0) {
          player.y--;
        }
      },
      ArrowRight(player) {
        console.log("Moving player Left");
        if (player.x < 9) {
          player.x++;
        }
      },
      ArrowDown(player) {
        console.log("AMoving player Down");
        if (player.y < 9) {
          player.y++;
        }
      },
      ArrowLeft(player) {
        console.log("Moving player Right");
        if (player.x > 0) {
          player.x--;
        }
      },
    };
    const keyPressed = command.keyPressed;
    const player = state.players[command.playerId];
    const moveFunction = acceptedMoves[keyPressed];

    if (moveFunction) {
      moveFunction(player);
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
