'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const Websocket = require('websocket').server;
const STATIC_PATH = path.join(process.cwd(), '../static');
const API_PATH = '../api';

const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/ico',
  json: 'application/json',
  svg: 'image/svg+xml',
};

const api = new Map();

const cacheFile = name => {
  const filePath = API_PATH + name;
  const key = path.basename(filePath, '.js');
  try {
    const libPath = require.resolve(filePath);
    delete require.cache[libPath];
  } catch (e) {
    return;
  }
  try {
    const method = require(filePath);
    api.set(key, method);
  } catch (e) {
    api.delete(name);
  }
};

const cacheFolder = path => {
  fs.readdir(path, (err, files) => {
    if (err) return;
    files.forEach(cacheFile);
  });
};

const watch = path => {
  fs.watch(path, (event, file) => {
    cacheFile(file);
  });
};

cacheFolder(API_PATH);
watch(API_PATH);

const httpError = (res, status, message) => {
  res.statusCode = status;
  res.end(`"${message}"`);
};

const serveFile = name => {
  const filePath = path.join(STATIC_PATH, name);
  if (!filePath.startsWith(STATIC_PATH)) return null;
  return fs.createReadStream(filePath);
};

const receiveArgs = async req => new Promise(resolve => {
  const body = [];
  req.on('data', chunk => {
    body.push(chunk);
  }).on('end', async () => {
    const data = body.join('');
    const args = JSON.parse(data);
    resolve(args);
  });
});


// http.createServer(async (req, res) => {
//   const url = req.url === '/' ? '/index.html' : req.url;
//   const [first, second] = url.substring(1).split('/');
//   if (first === 'api') {
//     const method = api.get(second);
//     const args = await receiveArgs(req);
//     try {
//       const result = await method(...args);
//       if (!result) {
//         httpError(res, 500, 'Server Error');
//         return;
//       }
//     } catch(e) {
//       console.dir({ err });
//       httpError(res, 500, 'Server error');
//     } 
//   } else {
//     const fileExt = path.extname(url).substring(1);
//     res.writeHead(200, { 'Content-Type': MIME_TYPES[fileExt] });
//     const stream = serveFile(url);
//     if (stream) stream.pipe(res);
//   }
// }).listen(8000);

const server = http.createServer(async (req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  // const [file] = url.substring(1).split('/');
  let path = `../static${url}`;
  // console.log(url, path)
  try {
    const data = await fs.promises.readFile(path);
    const splitted = url.split('.');
    const type = splitted[splitted.length - 1];
    res.writeHead(200, { 'Content-Type': MIME_TYPES[type] });
    res.end(data);
  } catch (err) {
    res.statusCode = 404;
    console.log(err);
    res.end('"File is not found"');
  }
}).listen(8000);

const ws = new Websocket({
  httpServer: server,
  autoAcceptConnections: false
});

ws.on('request', req => {
  const connection = req.accept('', req.origin);
  // console.log('Connected ' + connection.remoteAddress);
  connection.on('message', async message => {
    const dataName = message.type + 'Data';
    const data = message[dataName];
    // console.log(dataName, data);
    console.log(path.extname(dataName));
    // console.log('Received: ' + data);
    const obj = JSON.parse(data);
    const { method, args } = obj;
    const fn = api.get(method);
    try {
      const result = await fn(...args);
      if (!result) {
        connection.send('"No result"');
        return;
      }
      connection.send(JSON.stringify(result));
    } catch (err) {
      console.dir({ err });
      connection.send('"Server error"');
    }
  });
});