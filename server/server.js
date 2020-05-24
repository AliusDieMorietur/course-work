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

const serveStatic = (entryPoint, staticPath, port, mimeTypes, errorFunction) => {
  const server = http.createServer(async (req, res) => {
    const url = req.url === '/' ? entryPoint: req.url;
    console.log(url);
    let path = `${staticPath}${url}`;
    try {
      const data = await fs.promises.readFile(path);
      const splitted = url.split('.');
      const type = splitted[splitted.length - 1];
      res.writeHead(200, { 'Content-Type': mimeTypes[type] });
      res.end(data);
    } catch (err) {
      if (errorFunction) {
        errorFunction(err);
      } else {
        res.statusCode = 404;
        console.log(err);
        res.end('"File is not found"');
      }
    }
  }).listen(port);
  return server;
}

serveStatic('/index.html', STATIC_PATH, 8000, MIME_TYPES);

// const serveFile = name => {
//   const filePath = path.join(STATIC_PATH, name);
//   if (!filePath.startsWith(STATIC_PATH)) return null;
//   return fs.createReadStream(filePath);
// };

// http.createServer(async (req, res) => {
//   const url = req.url === '/' ? '/index.html' : req.url;
//   console.log(url);
//   const fileExt = path.extname(url).substring(1);
//   res.writeHead(200, { 'Content-Type': MIME_TYPES[fileExt] });
//   const stream = serveFile(url);
//   if (stream) stream.pipe(res);
// }).listen(8000);
