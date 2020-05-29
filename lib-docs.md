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
  Db | (name: String, version: String) | Initialize new database. 
  onSuccess | (func: (event: Object) => void) | Event which will be triggered when database will be available.
  onError | (func: (event: Object) => void) | Event which will be triggered when failed to get access to database.
  onUpgrade | (func: (event: Object) => void) | Event which will be triggered on the start
  initializeObject | (name: String, storageMethod: Object, indexes: Array) | Creates object where data will be stored.
  setData | (name: String, data: Any) | Adds data to the object.
  getData | (name: String, key: Any) => Promise | Gets data from the object.
  deleteData | (name: String, key: String) | Deletes data from the object.
  keys | (name: String) => Promise | Return keys of all data stored in object.
  has | (name: String, key: Any) => Promise | Checks availability of some value by key in object;
  async values | (name: String) => Promise | Return all values whch stored in object.
  async clearAll | (name: String) | Deletes all data in object.

## Basics
* Initialize db: 
```javascript
  const db = new Db('MyDataBase', 1);
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
    const indexes = [{ indexName: 'number', keyPath: 'number', optionalParameters: { unique: false }}];
    const randomNumbers = db.initializeObject('RandomNumbers', { keyPath: 'date'}, indexes);
  };
```

* Choose how to track your data
  keyPath | Key Generator | Description
  ------- | ------------- | -----------
  No | No |	This object store can hold any kind of value, even primitive values like numbers and strings. You must supply a separate key argument whenever you want to add a new value.
  Yes |	No | This object store can only hold JavaScript objects. The objects must have a property with the same name as the key path.
  No | Yes | This object store can hold any kind of value. The key is generated for you automatically, or you can supply a separate key argument if you want to use a specific key.
  Yes |	Yes |	This object store can only hold JavaScript objects. Usually a key is generated and the value of the generated key is stored in the object in a property with the same name as the key path. However, if such a property already exists, the value of that property is used as key rather than generating a new key.

* Createing indexes: 
indexName will define which name your index will have. keyPath will define by which property information will be find, optionalParamters defines some additional properties. 
```javascript
  const indexes = [
    { indexName: 'number', keyPath: 'number', optionalParameters: { unique: false }},
    { indexName: 'ssn', keyPath: 'ssn', optionalParameters: { unique: true }},
  ];
```

* Set | Get | Delete data from your object
```javascript
  db.setData('MyObject', { myKeyPath: 'Some uniqe key', myValue: 'Some value' });
  db.getData('MyObject', 'Some uniqe key');
  db.deleteData('MyObject', 'Some uniqe key');
```

* Use additional methods to work much easier with your data:
```javascript
  db.has('MyObject', 'Some uniqe key');
  db.keys('MyObject');
  db.values('MyObject'); 
  db.clearAll('MyObject')
```
