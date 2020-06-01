# Documetation for lib
## WorkerTools
  Name | Parameters | Desription 
  ---- | ---------- | ---------- 
  registerServiceWorker | (path: String, log = true, [errorFunction: (error) => void]) | Register service worker by it's path.
  install | (files: Array, version: String) | Intercept install event and cache files automaticly.
  interceptFecth | (version: String) | Intercept fetch event and load files from cache automaticly.
## Db
  Name | Parameters | Desription 
  ---- | ---------- | ---------- 
  Constructor | (name: String, version: String) | Initialize new database. 
  onSuccess | (func: (event: Object) => void) | Event which will be triggered when database will be available.
  onError | (func: (event: Object) => void) | Event which will be triggered when failed to get access to database.
  onUpgrade | (func: (event: Object) => void) | Event which will be triggered on the start
  initializeObject | (name: String, storageMethod: Object, indexes: Array) | Creates object where data will be stored.
  openTransaction | (name: String) | There are another way to access transaction but this is more convenient way.
  setData | (name: String, data: Any) | Adds data to the object.
  getData | (name: String, key: Any) => Promise | Gets data from the object.
  deleteData | (name: String, key: String) | Deletes data from the object.
  keys | (name: String) => Promise | Return keys of all data stored in object.
  has | (name: String, key: Any) => Promise | Checks availability of some value by key in object;
  values | async (name: String) => Promise | Return all values whch stored in object.
  clearAll | async (name: String) | Deletes all data in object.
  openCursor | (name: String) | Returns object where you can get <code>onSuccess</code> event with iterator to get all objects in objectStore.
  openIndexCursor | (name: String, indexName: String) | Returns object where you can get <code>onSuccess</code> event with iterator to get all objects by index and get access to whole object on current step.
  openIndexKeyCursor | (name: String, indexName: String) | Returns object where you can get <code>onSuccess</code> event with iterator to get all objects by index and get access only to the key.
  getIndex | (name: String, indexName: String) | Return index by name.
  deleteDatabase | (name: String) | Delete database.

## Basics
* Register Worker
```javascript
  WorkerTools.registerServiceWorker('your worker path');
```

* Install Worker
```javascript
  importScripts('./js/app-lib.js');

  const version = 'v1';

  const files = [ // files which will be cached
    '/folder_1',
    '/file_1',
    '/folder_2/file_2',
  ];

  WorkerTools.install(files, version);
```

* Intercept "fetch"
```javascript
  WorkerTools.interceptFecth(version);
```

* Initialize db: 
```javascript
  const db = new Db('YourDataBase', 1);
```

* Catch basic events:
```javascript
  db.onSuccess = event => {};
  db.onUpgrade = event => {};
  db.onError = event => {}
```

* Initialize your first object when db just created:
```javascript
  db.onUpgrade = event => {
    const indexes = [{ indexName: 'YourIndex', keyPath: 'YourKeyPath', optionalParameters: { unique: false }}];
    const randomNumbers = db.initializeObject('YourObject', { keyPath: 'YourKey'}, indexes);
  };
```

* Choose how to track your data
  key Path | Key Generator | Description
  ------- | ------------- | -----------
  No | No |	This object store can hold any kind of value, even primitive values like numbers and strings. You must supply a separate key argument whenever you want to add a new value.
  Yes |	No | This object store can only hold JavaScript objects. The objects must have a property with the same name as the key path.
  No | Yes | This object store can hold any kind of value. The key is generated for you automatically, or you can supply a separate key argument if you want to use a specific key.
  Yes |	Yes |	This object store can only hold JavaScript objects. Usually a key is generated and the value of the generated key is stored in the object in a property with the same name as the key path. However, if such a property already exists, the value of that property is used as key rather than generating a new key.

* Createing indexes: 
<code>indexName</code> will define which name your index will have. <code>keyPath</code> will define by which property information will be found, <code>optionalParamters</code> defines some additional properties. 
```javascript
  const indexes = [
    { indexName: 'key', keyPath: 'key', optionalParameters: { unique: false }},
    { indexName: 'ssn', keyPath: 'ssn', optionalParameters: { unique: true }},
  ];
```

* Set | Get | Delete data from your object
```javascript
  db.setData('YourObject', { myKeyPath: 'Some unique key', myValue: 'Some value' });
  db.getData('YourObject', 'Some unique key');
  db.deleteData('YourObject', 'Some unique key');
```

* Get data from cursor
```javascript
db.openCursor('').onSuccess = cursor => {
    if (cursor) {
      const value = cursor.value;
      const key = cursor.key;
      console.log(key, value);
      cursor.continue();
    }
    else {
      console.log('no more entries');
    }
  }
```

* Use additional methods to work much easier with your data:
```javascript
  db.has('YourObject', 'Some unique key');
  db.keys('YourObject');
  db.values('YourObject'); 
  db.clearAll('YourObject')
```
