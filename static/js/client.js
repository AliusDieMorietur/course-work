'use strict';

WorkerTools.registerServiceWorker('./worker.js');

window.addEventListener('beforeinstallprompt', event => {
  console.log('Installing PWA');
  console.dir({ beforeinstallprompt: event });
});

window.addEventListener('appinstalled', event => {
  console.log('PWA installed');
  console.dir({ appinstalled: event });
});

const getBtn = document.getElementById('get');
const view = document.getElementById('view');
const minInput = document.getElementById('min');
const maxInput = document.getElementById('max');

const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

getBtn.addEventListener('click', () => {
  const minValue = minInput.value;
  const maxValue = maxInput.value;
  if(!minValue || !maxValue) {
    view.innerHTML = 'Enter valid numbers';
  }
  if(maxValue && minValue) {
    const random = getRandom(minValue, maxValue);
    view.innerHTML = 'Your number: ' + random;
    db.setData('RandomNumbers', { date: `${Date.now()}`, number: random });
  }
});

const db = new Db('MyDataBase', 1);

window.addEventListener('load', () => {
  console.log(1);
})

db.request.onsuccess = event => {
  db.db = event.target.result;
  console.log(1);
}

db.request.onupgradeneeded = event => {
  console.log(2);
  db.db = event.target.result;
  const indexes = [{ indexName: 'number', keyPath: 'number', optionalParameters: { unique: false }}];
  const randomNumbers = db.initializeObject('RandomNumbers', { keyPath: 'date'}, indexes);
};

db.request.onerror = event => {
  console.log(event);
};