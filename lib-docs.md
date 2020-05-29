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
  getData | (name: String, key: Any) | Gets data from the object.
  deleteData | (name: String, key: String) | Deletes data from the object.
  keys | (name: String) | Return keys of all data stored in object.
  has | (name: String, key: Any) | Checks availability of some value by key in object;
  async values | (name: String) | Return all values whch stored in object.
  async clearAll | (name: String) | Deletes all data in object.