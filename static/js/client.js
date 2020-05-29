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
const delBtn = document.getElementById('deleteAll');
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
    db.setData('RandomNumbers', { date: `${Date.now()}`, number: random });
    renderObject('RandomNumbers');
  }
});

delBtn.addEventListener('click', async () => {
  await db.clearAll('RandomNumbers');
  renderObject('RandomNumbers');
});

const renderObject = object => {
  numberBox.innerHTML = '';
  db.values(object).then(values => {
    for (const value of values) {
      const myNumber = value.number;
      const deleteNumber = `
        db.deleteData('${object}', '${value.date}');
        renderObject('${object}');
      `;
      numberBox.innerHTML += `<li><label>key: ${value.date}; value: ${myNumber} </label><button onclick="${deleteNumber}" id="${value.date}">X</button></li>`
      // const deleteBtn = document.getElementById(value.date); // doesn't works for some reason.
      // console.log(numberBox.innerHTML);
      // deleteBtn.addEventListener('click', () => {
      //   db.deleteData(object, value.date); 
      //   renderObject(object);
      // });
    }
  });
}

const db = new Db('MyDataBase', 1);

db.onSuccess = event => {
  db.has('RandomNumbers', '1590762678560').then(console.log);
  renderObject('RandomNumbers');
};

db.onUpgrade = event => {
  const indexes = [{ indexName: 'number', keyPath: 'number', optionalParameters: { unique: false }}];
  const randomNumbers = db.initializeObject('RandomNumbers', { keyPath: 'date'}, indexes);
};

db.onError = console.log;

