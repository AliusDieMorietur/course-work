'use strict';

const readline = require('readline');
const net = require('net');
const socket = new net.Socket();

const connect = () => {
  console.log('connected', socket.remotePort);
  socket.write('connection established');
  requestCommand();
}

socket.on('data', data => {
  console.log('recieved from server');
  console.log(data.toString());
  requestCommand();
});

socket.on('close', () => {
  console.log('connection closed');
});

socket.on('error', err => {
  socket.destroy();
  console.log(err);
  process.exit(1);
})

socket.connect(8000, '127.0.0.1', connect);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const commands = {
  exit: () => {
    socket.destroy();
    console.log('connection closed');
    process.exit(0);
  },
  help: () => {
    for (let key in commands) console.log(` <${key}> `);
  },
  about: () => {
    console.log('Course work by Ilja Kaminskij IP-95');
  },
  send: () => {
    console.log('enter something');
    rl.question('> ', (input) => {
      socket.write(input);
      requestCommand();
    });
  },
  get: () => {
    socket.write('get');
    requestCommand();
  }
}

const requestCommand = () => {
  rl.question('> ', (input) => {
    commands[input] ? commands[input]() : console.log(`command <${input}> not found, try <help>`);
    requestCommand();
  });
}
