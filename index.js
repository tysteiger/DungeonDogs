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
    }
  })

  socket.on('playerMovement', (playerMovement) => {
    //Someone Moved!
    const player = gameState.players[socket.id]
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
  })


  socket.on("disconnect", () => {
    //When someone leaves, remove them from the gamestate
    delete gameState.players[socket.id]
  })
})

//Emit the gamestate to the clients 60 times / second
setInterval(() => {
  io.sockets.emit('state', gameState);
}, 1000 / 60);

//Start the server on port 3000
http.listen(3000, () => {
  console.log('listening on *:3000');
});