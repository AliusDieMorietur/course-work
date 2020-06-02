
'use strict';

const url = '/test';

const test = {};

const send = new Promise((resolve, reject) => {
  const db = new Db('test-db', 1);
  db.onUpgrade = event => {
    test['onUpgrade'] = { status: 'passed' };
    const indexes = [
      { indexName: 'test', keyPath: 'test', optionalParameters: { unique: false }}
    ];
    db.initializeObject('testObject', { keyPath: 'date'}, indexes);
  };
  db.onSuccess = event => {
    test['onSuccess'] = { status: 'passed' };
    const functions = [
      db.getObject,
      db.setData,
      db.has,
      db.getData,
      db.keys,
      db.values
    ].map(el => el.bind(db));
    const args = [
      ['testObject'],
      ['testObject', { date: `${Date.now()}`, test: '1' }],
      ['testObject', `${Date.now()}`],
      ['testObject', `${Date.now()}`],
      ['testObject'],
      ['testObject']
    ];
    for (let i = 0; i < functions.length; i++) {
      const func = functions[i];
      const arg = args[i];
      try {
        func(...arg);
        const pack = { ...arg };
        test[`${i}_${func.name}`] = { status: 'passed', pack };
      } catch (error) {
        test[`${i}_${func.name}`] = { status: 'failed', msg: error.message };
      }
    };
    resolve(test);
  }
}).then(data => {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => {
    const { status } = res;
    if (status !== 200) {
      reject(new Error(`Status Code: ${status}`));
      return;
    }
    console.log(res.json());
  });
});
 
setTimeout(() => {
  window.close();
}, 500);
