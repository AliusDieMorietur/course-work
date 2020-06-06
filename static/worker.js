'use strict';

importScripts('./js/app-lib.js');

const version = 'v1';

const files = [
  '/',
  '/assets/greek.ico',
  '/css/style.css',
  '/js/client.js',
  '/favicon.ico',
  '/favicon.png',
  '/empty.png',
  '/manifest.json',
  '/js/app-lib.js',
];

WorkerTools.install(files, version);
WorkerTools.interceptFecth(version);

