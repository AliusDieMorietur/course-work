'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const STATIC_PATH = path.join(process.cwd(), '../static');
const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/ico',
  json: 'application/json',
  svg: 'image/svg+xml',
};

const serveFile = name => {
  const filePath = path.join(STATIC_PATH, name);
  if (!filePath.startsWith(STATIC_PATH)) return null;
  return fs.createReadStream(filePath);
};

http.createServer(async (req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  console.log(url);
  const fileExt = path.extname(url).substring(1);
  res.writeHead(200, { 'Content-Type': MIME_TYPES[fileExt] });
  const stream = serveFile(url);
  if (stream) stream.pipe(res);
}).listen(8000);


