//Initialize the server
var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http)

//Serve the /client folder
var htmlPath = path.join(__dirname, 'client');
app.use(express.static(htmlPath));

//Variable that stores the players
const gameState = {
  players: {}
}
//Function that is called whenever someone joins
io.on('connection', (socket) => {
  socket.on('newPlayer', () => {
    //Someone joined!
    gameState.players[socket.id] = {
      x: 250,
      y: 250,
      playerHeight: 50
    }
  })

  socket.on('playerMovement', (playerMovement) => {
    //Someone Moved!
    const player = gameState.players[socket.id]
    player.movement = playerMovement;

    //These are boundaries
    const canvasWidth = 1200
    const canvasHeight = 700

    //Use the object to move the players coordinates
    if (playerMovement.left && player.x > 0) {
      player.x -= 4
    }
    if (playerMovement.right && player.x < canvasWidth) {
      player.x += 4
    }

    if (playerMovement.up && player.y > 0) {
      player.y -= 4
    }
    if (playerMovement.down && player.y < canvasHeight) {
      player.y += 4
    }

    // Jump processing
    if (playerMovement.jump && !player.jumping) {
      player.jumping = true;
      player.yVelocity = -10; // Initial jump velocity
      player.groundLevel = player.y;
    }
  })

  socket.on("disconnect", () => {
    //When someone leaves, remove them from the gamestate
    delete gameState.players[socket.id]
  })

  socket.on('canvasSize', (size) => {
    gameState.players[socket.id].canvasHeight = size.height;
    gameState.players[socket.id].canvasWidth = size.width;
  });
})

//Emit the gamestate to the clients 60 times / second
// Game Loop
setInterval(() => {
  for (let id in gameState.players) {
    let player = gameState.players[id];
    const movement = player.movement || {}; // Get the stored movement state

    // Horizontal movement
    if (movement.left && player.x > 0) {
      player.x -= 4;
    }
    if (movement.right && player.x < player.canvasWidth) {
      player.x += 4;
    }

    // Jumping
    if (player.jumping) {
      player.y += player.yVelocity;
      player.yVelocity += 1; // Gravity effect

      if (player.y >= player.groundLevel) { // Landing
        player.y = player.groundLevel;
        player.jumping = false;
        player.yVelocity = 0;
      }
    }

    // Boundary checks
    const playerCanvasHeight = player.canvasHeight || 700; // Default value if not set
    if (player.y + player.playerHeight > playerCanvasHeight) { // Assuming playerHeight is the height of player
      player.y = playerCanvasHeight - player.playerHeight; // Adjust position to stay within bounds
      // ... handle landing and reset jump state if needed ...
    }
  }
  io.sockets.emit('state', gameState);
}, 1000 / 60);

//Start the server on port 3000
http.listen(3000, () => {
  console.log('listening on *:3000');
});