'use strict';

const http = require('http');
const fs = require('fs');

const serveStatic = (entryPoint, staticPath, port, mimeTypes, errorFunction) => {
  const server = http.createServer(async (req, res) => {
    const url = req.url === '/' ? entryPoint: req.url;
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

const serveWorker = async (res, url, path, errorFunction) => {
  if (url.includes('worker.js')) {
    try {
      const data = await fs.promises.readFile(path);
      res.end(data);
    } catch (err) {
      if (errorFunction) {
        errorFunction(err);
      } else {
        res.statusCode = 404;
        console.log(err);
        res.end('File is not found');
      }
    }
    return true;
  }
  return false;
}

const installWorker = (files, version) => {
  self.addEventListener('install', event => event.waitUntil(caches.open(version).then(cache => cache.addAll(files))));
}

const interceptFecth = (version) => {
  self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(response => {
      if (response !== undefined) return response;
      return fetch(event.request).then(response => {
        const responseClone = response.clone();
        caches.open(version).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(error => {
        throw error;
      });
    }));
  });
}

