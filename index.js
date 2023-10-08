const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const currentPlayerId = "player1";
function createGame() {
  const state = {
    players: {
      // player1: { y: 1, x: 1 },
      // player2: { y: 3, x: 9 },
    },
    fruits: {
      // fruit1: { y: 1, x: 3 },
    },
  };

  const addPlayer = (command) => {
    const { playerId, playerY, playerX } = command;

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };
  };

  const removePlayer = (command) => {
    const playerId = command.playerId;

    delete state.players[playerId];
  };

  const addFruit = (command) => {
    const { fruitId, fruitY, fruitX } = command;

    state.fruits[fruitId] = {
      y: fruitY,
      x: fruitX,
    };
  };

  const removefruit = (command) => {
    const fruitsId = command.fruitId;

    delete state.fruits[fruitsId];
  };

  function movePlayer(command) {
    // console.log(`Moving ${command.playerId} with ${command.keyPressed}`);

    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y > 0) {
          player.y--;
        }
      },
      ArrowRight(player) {
        if (player.x < 9) {
          player.x++;
        }
      },
      ArrowDown(player) {
        if (player.y < 9) {
          player.y++;
        }
      },
      ArrowLeft(player) {
        if (player.x > 0) {
          player.x--;
        }
      },
    };
    const keyPressed = command.keyPressed;
    const player = state.players[command.playerId];
    const moveFunction = acceptedMoves[keyPressed];
    const playerId = command.playerId;
    if (moveFunction && player) {
      moveFunction(player);
      checkForFruitCollision(playerId);
    }
  }

  const checkForFruitCollision = (playerId) => {
    const player = state.players[playerId];
    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];
      console.log(`Checking ${playerId} and ${fruitId}`);

      if (fruit.y === player.y && fruit.x === player.x) {
        removefruit({ fruitId });
        console.log(`Colilssion in square ${(fruit.x, fruit.y)}`);
      }
    }
    //
  };

  return {
    movePlayer,
    state,
    addPlayer,
    removePlayer,
    addFruit,
    removefruit,
  };
}

const game = createGame();

const keyboardListener = createKeyboardListener();
keyboardListener.subscribe(game.movePlayer);

game.addPlayer({ playerId: "player1", playerX: 0, playerY: 0 });
game.addPlayer({ playerId: "player2", playerX: 5, playerY: 5 });
game.addPlayer({ playerId: "player3", playerX: 6, playerY: 3 });
game.addFruit({ fruitId: "fruit1", fruitX: 3, fruitY: 3 });
game.addFruit({ fruitId: "fruit2", fruitX: 4, fruitY: 8 });

function createKeyboardListener() {
  const state = {
    observers: [],
  };

  function subscribe(observersFunction) {
    state.observers.push(observersFunction);
  }

  function notifyAll(command) {
    // console.log(`Notifying ${state.observers.length} observers`);
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
