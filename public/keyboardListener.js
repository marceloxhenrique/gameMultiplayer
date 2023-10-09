export default function createKeyboardListener(document) {
  const state = {
    observers: [],
    playerId: null,
  };

  function registerPlayerId(playerId) {
    state.playerId = playerId;
  }

  function subscribe(observersFunction) {
    state.observers.push(observersFunction);
  }

  function notifyAll(command) {
    for (const observersFunction of state.observers) {
      observersFunction(command);
    }
  }

  document.addEventListener("keydown", handleKeyDown);

  function handleKeyDown(e) {
    const keyPressed = e.key;

    const command = {
      type: "move-player",
      playerId: state.playerId,
      keyPressed,
    };

    notifyAll(command);
  }

  return {
    subscribe,
    registerPlayerId,
  };
}
