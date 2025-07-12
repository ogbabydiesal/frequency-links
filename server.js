'use strict';

const socketIO = require('socket.io');
const express = require('express');
const path = require('path');
const app = module.exports.app = express();
const port = process.env.PORT || 3000;


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(port, () => {
  console.log("Listening on port: " + port);
});

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  console.log(socket.id);
  
  socket.on("controller", (arg) => {
    io.emit('response', arg);
  });
  
  //receives the frequency emitter from Client
  socket.on("frequency", (arg) => {
    console.log(arg); 
    io.emit('freqResponse', arg);
  });
socket.on("name", (arg) => {
    //console.log(arg);
    io.emit('response', arg);
  });
  socket.on('disconnect', () => console.log('Client disconnected'));
});

let time = 0;

function timeKeeper() {
  setTimeout(() => {
    time += 1;
    //causes event to happen every two seconds
    if (time % 2 == 0) {
      const random = Math.floor(Math.random() * 100);
      const random2 = Math.floor(Math.random() * 100);
      const trigger = [random, random2];
      //io.emit('trigger', trigger);
      time = 0;
    }
    timeKeeper();
  }, "1000"); 
}

timeKeeper();

