'use strict';

const net = require('net');
const fs = require('fs');

const DATABASE = './database.json';

const save = input => {
  fs.appendFile('database.json', JSON.stringify(input), err => {
    if (err) throw err;
  });
}

const sendOnClient = socket => {
  fs.readFile(DATABASE, (err, data) => {
    if (err) throw err;
    socket.write(data);
  });
}

const server = net.createServer(socket => {
  socket.on('data', data => {
    console.log('recieved from client');
    console.log(data.toString());
    if (data.toString() === 'get') {
      sendOnClient(socket);
      return;
    }
    save(data);
    console.log('saved');
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

