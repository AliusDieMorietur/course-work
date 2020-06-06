'use strict';

WorkerTools.registerServiceWorker('./worker.js');

const db = new Db('MyDatabase', 1);
const getBtn = document.getElementById('get');
const delBtn = document.getElementById('deleteAll');
const numberBox = document.getElementById('numbers');
const view = document.getElementById('view');
const minInput = document.getElementById('min');
const maxInput = document.getElementById('max');

const renderObject = object => {
  numberBox.innerHTML = '';
  db.openCursor(object).onSuccess = cursor => {
    if (cursor) {
      const myNumber = cursor.value.number;
      const key = cursor.key;
      const deleteNumber = `
        db.deleteData('${object}', '${key}');
        renderObject('${object}');
      `;
      numberBox.innerHTML +=
        `<li>
          <label>key: ${key}; value: ${myNumber}</label>
          <button onclick="${deleteNumber}" id="${key}">X</button>
        </li>`;
      cursor.continue();
    }
  };
};

db.onSuccess = async event => {
  console.log(event);
  const available = await db.has('RandomNumbers', '1590762678560');
  console.log(`Available: ${available}`);
  renderObject('RandomNumbers');
  console.log(db.getIndex('RandomNumbers', 'number'));
};

db.onUpgrade = event => {
  console.log(event);
  const indexes = [
    { indexName: 'number', keyPath: 'number', optionalParameters: { unique: false } }
  ];
  db.initializeObject('RandomNumbers', { keyPath: 'date' }, indexes);
};

db.onError = console.log;

window.addEventListener('beforeinstallprompt', event => {
  console.log('Installing PWA');
  console.dir({ beforeinstallprompt: event });
});

window.addEventListener('appinstalled', event => {
  console.log('PWA installed');
  console.dir({ appinstalled: event });
});

const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

getBtn.addEventListener('click', () => {
  const minValue = minInput.value;
  const maxValue = maxInput.value;
  if (!minValue || !maxValue) {
    view.innerHTML = 'Enter valid numbers';
  }
  if (maxValue && minValue) {
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


