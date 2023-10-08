export default function createKeyboardListener(document) {
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
