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
const numberBox = document.getElementById('numbers');
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
    view.innerHTML = `Your number: ${random}`;
    numberBox.innerHTML += `<li>${random}</li>`
    db.setData('RandomNumbers', { date: `${Date.now()}`, number: random });
  }
});

const db = new Db('MyDataBase', 1);

db.onSuccess = () => {
  db.keys('RandomNumbers').then(keys => {
    for (const key of keys) {
      db.getData('RandomNumbers', key).then(data => {
        const myNumber = data.number;
        numberBox.innerHTML += `<li>${myNumber}</li> `;
      });
    };
  });
};

db.onUpgrade = () => {
  const indexes = [{ indexName: 'number', keyPath: 'number', optionalParameters: { unique: false }}];
  const randomNumbers = db.initializeObject('RandomNumbers', { keyPath: 'date'}, indexes);
};

db.onError = console.log;

