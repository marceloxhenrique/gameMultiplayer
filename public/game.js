export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    canvas: {
      width: 10,
      height: 10,
    },
  };
  const observers = [];

  function start() {
    const frequency = 2000;

    setInterval(addFruit, frequency);
  }

  function subscribe(observersFunction) {
    observers.push(observersFunction);
  }

  function notifyAll(command) {
    for (const observersFunction of observers) {
      observersFunction(command);
    }
  }
  function setState(newState) {
    Object.assign(state, newState);
  }

  const addPlayer = (command) => {
    const playerId = command.playerId;
    const playerY =
      "playerY" in command
        ? command.playerY
        : Math.floor(Math.random() * state.canvas.height);
    const playerX =
      "playerX" in command
        ? command.playerX
        : Math.floor(Math.random() * state.canvas.width);

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };

    notifyAll({
      type: "add-player",
      playerId: playerId,
      playerX: playerX,
      playerY: playerY,
    });
  };

  const removePlayer = (command) => {
    const playerId = command.playerId;

    delete state.players[playerId];

    notifyAll({
      type: "remove-player",
      playerId: playerId,
    });
  };

  const addFruit = (command) => {
    const fruitId = command
      ? command.fruitId
      : Math.floor(Math.random() * 10000000);
    const fruitX = command
      ? command.fruitX
      : Math.floor(Math.random() * state.canvas.width);
    const fruitY = command
      ? command.fruitY
      : Math.floor(Math.random() * state.canvas.height);

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };

    notifyAll({
      type: "add-fruit",
      fruitId: fruitId,
      fruitX: fruitX,
      fruitY: fruitY,
    });
  };

  const removeFruit = (command) => {
    const fruitId = command.fruitId;

    delete state.fruits[fruitId];
    notifyAll({
      type: "remove-fruit",
      fruitId: fruitId,
    });
  };

  function movePlayer(command) {
    notifyAll(command);

    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y > 0) {
          player.y--;
        }
      },
      ArrowRight(player) {
        if (player.x < state.canvas.width - 1) {
          player.x++;
        }
      },
      ArrowDown(player) {
        if (player.y < state.canvas.height - 1) {
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
        removeFruit({ fruitId });
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
    removeFruit,
    setState,
    subscribe,
    start,
  };
}
