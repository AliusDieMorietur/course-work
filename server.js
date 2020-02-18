'use strict';

const net = require('net');

const server = net.createServer(socket => {
  socket.on('data', data => {
    console.log('recieved from client');
    console.log(data.toString());
  });
  
  socket.on('error', err => {
    console.log('ERROR');
    console.log(err);
  });
});



server.listen({
  host: '127.0.0.1',
  port: 8000
});