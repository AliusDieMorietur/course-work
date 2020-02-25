'use strict';

const net = require('net');
const fs = require('fs');

const DATABASE = './database.json';
const logs = './logs.txt';

const log = input => {
  fs.appendFile('logs.txt', JSON.stringify(input), err => {
    if (err) throw err;
  });
}

const commands = {
  get: socket => {
    fs.readFile(logs, (err, data) => {
      if (err) throw err;
      socket.write(data);
    });
  },
};

const server = net.createServer(socket => {
  socket.on('data', data => {
    console.log('recieved from client');
    commands[data.toString()] ? commands[data.toString()](socket) : console.log(data.toString());
    log({ event: data.toString(), date: new Date() });
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

