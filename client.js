'use strict';

const readline = require('readline');
const net = require('net');
const socket = new net.Socket();

const connect = () => {
  console.log('connected', socket.remotePort);
  socket.write('It`s Ok');
  requestCommand();
}

socket.on('data', data => {
  console.log('recieved from server');
  console.log(data);
});

socket.on('close', () => {
  console.log('connection closed');
});

socket.connect(8000, '127.0.0.1', connect);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const sendInf = string => {

}

const commands = {
  exit: () => {
    socket.destroy();
    console.log('connection closed');
    process.exit(0);
  },
  help: () => {
    for (let key in commands) console.log(` <${key}>`);
  },
  about: () => {
    console.log('Course work by Ilja Kaminskij IP-95');
  }
}

const requestCommand = () => {
  rl.question('> ', (input) => {
    commands[input] ? commands[input]() : console.log(`command <${input}> not found, try <help>`);
    requestCommand();
  });
}
