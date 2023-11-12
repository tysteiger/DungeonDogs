//get the canvas
var canvas = document.getElementById("game")

//Object that stores the current pressed keys
const playerMovement = {
  up: false,
  down: false,
  left: false,
  right: false,
  jump: false
};

//Function that runs whenever a key is pressed, and updates the object
const keyDownHandler = (e) => {
  switch (e.keyCode) {
    case 39: // Right arrow
    case 68: // 'D'
      playerMovement.right = true;
      break;
    case 37: // Left arrow
    case 65: // 'A'
      playerMovement.left = true;
      break;
    case 38: // Up arrow
    case 87: // 'W'
      playerMovement.up = true;
      break;
    case 40: // Down arrow
    case 83: // 'S'
      playerMovement.down = true;
      break;
    case 32: // Spacebar for jump
      playerMovement.jump = true;
      break;
  }
};
//Function that runs when a key is released, and updates the object
// Key Up Handler
const keyUpHandler = (e) => {
  switch (e.keyCode) {
    case 39: // Right arrow
    case 68: // 'D'
      playerMovement.right = false;
      break;
    case 37: // Left arrow
    case 65: // 'A'
      playerMovement.left = false;
      break;
    case 38: // Up arrow
    case 87: // 'W'
      playerMovement.up = false;
      break;
    case 40: // Down arrow
    case 83: // 'S'
      playerMovement.down = false;
      break;
    case 32: // Spacebar for jump
      playerMovement.jump = false;
      break;
  }
};

//Make the functions run whenever the events happen
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

//Send the movement to server 60 times / second
setInterval(() => {
  socket.emit('playerMovement', playerMovement);
}, 1000 / 60);