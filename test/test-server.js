'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const STATIC_PATH = path.join(process.cwd(), './test/');

const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/ico',
  json: 'application/json',
  svg: 'image/svg+xml',
};

const receiveData = async req => new Promise(resolve => {
  const body = [];
  req.on('data', chunk => {
    body.push(chunk);
  }).on('end', async () => {
    const data = body.join('');
    const args = JSON.parse(data);
    resolve(args);
  });
});

const serveFile = name => {
  const filePath = path.join(STATIC_PATH, name);
  if (!filePath.startsWith(STATIC_PATH)) return null;
  return fs.createReadStream(filePath);
};

http.createServer(async (req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  const first = url.substring(1).split('/')[0];
  const fileExt = path.extname(url).substring(1);
  if (first === 'test') {
    const result = await receiveData(req);
    console.log(result);
    let passed = 0;
    let failed = 0;
    for (const index in result) {
      const status = result[index].status;
      if (status === 'passed') ++passed;
      if (status === 'failed') ++failed;
    }
    console.log(`Tests failed: ${failed}`);
    console.log(`Tests passed: ${passed}`);
    process.exit(0);
  } else {
    res.writeHead(200, { 'Content-Type': MIME_TYPES[fileExt] });
    const stream = serveFile(url);
    if (stream) stream.pipe(res);
  }
}).listen(7000);



