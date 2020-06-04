# Documetation for lib
## WorkerTools
  Methods | Desription 
  ------- | ---------- 
  <code>static registerServiceWorker(path: String, log = true, errorFunction: (error))</code> | Register service worker by it's path, so browser can detect which tasks your worker should do.
  <code>static install(files: Array, version: String)</code> | Add cache to the worker when it just installed.
  <code>static interceptFecth(version: String)</code> | Intercept fetch event, clone response and open when it is needed.

## Db

### Fields
  Field | Desription 
  ----- | ---------- 
  <code>name: String</code> | Holds DataBase name
  <code>version: Number</code> | Holds DataBase version
  <code>request: Object</code> | Reference to request object
  <code>db: Object</code> | Reference directly to DataBase
  <code>onSuccess: event</code> | Success event 
  <code>onUpgrade: event</code> | Upgrade event
  <code>onError: event</code> | Error event

### Methods
  Method | Desription 
  ------ | ---------- 
  <code>Constructor(name: String, version: String)</code> | Initialize new database. 
  <code>onSuccess(func: (event: Object) => void)</code> | Event which will be triggered when database will be available.
  <code>onError(func: (event: Object) => void)</code> | Event which will be triggered when failed to get access to database.
  <code>onUpgrade(func: (event: Object) => void)</code> | Event which will be triggered on the start
  <code>initializeObject(name: String, storageMethod: Object, indexes: Array)</code> | Creates object where data will be stored.
  <code>openTransaction(name: String)</code> | There are another way to access transaction but this is more convenient way.
  <code>setData(name: String, data: Any)</code> | Adds data to the object.
  <code>getData(name: String, key: Any) => Promise</code> | Gets data from the object.
  <code>deleteData(name: String, key: String)</code> | Deletes data from the object.
  <code>keys(name: String) => Promise</code> | Return keys of all data stored in object.
  <code>has(name: String, key: Any) => Promise</code> | Checks availability of some value by key in object;
  <code>async values(name: String) => Promise</code> | Return all values whch stored in object.
  <code>async clearAll(name: String)</code> | Deletes all data in object.
  <code>openCursor(name: String)</code> | Returns object where you can get <code>onSuccess</code> event with iterator to get all objects in objectStore.
  <code>openIndexCursor(name: String, indexName: String)</code> | Returns object where you can get <code>onSuccess</code> event with iterator to get all <code>objects by index and get access to whole object on current step.
  <code>openIndexKeyCursor(name: String, indexName: String)</code> | Returns object where you can get <code>onSuccess</code> event with iterator to get all <code>objects by index and get access only to the key.
  <code>getIndex(name: String, indexName: String)</code> | Return index by name.
  <code>deleteDatabase(name: String)</code> | Delete database.

## Basics
* Register Worker
  Register service worker by it's path, so browser can detect which tasks your worker should do.
```javascript
  WorkerTools.registerServiceWorker('/your worker path');
```

* Install Worker
 When service worker will be installed it will automatically cache all files which declared in <code>files: Array</code>
 and it's <code>version: String</code>
 > For most projects this task will be same, but you always can rewrite it as you want
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
  When your client sends "fetch" to server it will be intercepted and 
  checked is there access to server or not and gain data from server or from cache.
> For most projects this task will be same, but you always can rewrite it as you want
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
  When your Database just created you need to initialize objects which you will 
  use in future, you can do it at any time, but at the creation moment it will be the most valuable 
```javascript
  db.onUpgrade = event => {
    const indexes = [{ indexName: 'YourIndex', keyPath: 'YourKeyPath', optionalParameters: { unique: false }}];
    const randomNumbers = db.initializeObject('YourObject', { keyPath: 'YourKey'}, indexes);
  };
```

* Choose how to track your data
  key Path | Key Generator | Description
  -------- | ------------- | -----------
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
  You can iterate through cursor and get data from it on each step 
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
  Useful methods which follow Map conception
```javascript
  db.has('YourObject', 'Some unique key');
  db.keys('YourObject');
  db.values('YourObject'); 
  db.clearAll('YourObject')
```
