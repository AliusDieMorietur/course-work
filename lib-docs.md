# Documetation for lib
## WorkerTools
* registerServiceWorker(path, log = true, errorFunction)
* installWorker(files, version)
* interceptFecth(version)
## Db
  Name | Parameters | Desription 
  ---- | ---------- | ---------- 
  Db | (name: String, version: String) | Initialize new database. 
  onSuccess | (func: (event: Object) => void) | Event which will be triggered when database will be available.
  onError | (func: (event: Object) => void) | Event which will be triggered when failed to get access to database.
  onUpgrade | (func: (event: Object) => void) | Event which will be triggered on the start
  initializeObject | (name: String, storageMethod: Object, indexes: Array) | Creates object where data will be stored.
  setData | (name: String, data: Any) | Adds data to the object.
  getData | (name: String, key: String) | Gets data from the object.
  deleteData | (name: String, key: String) | Deletes data from the object.
  keys | (name: String) | Return keys of all data stored in object.
  async values | (name: String) | Return all values whch stored in object.
  async clearAll | (name: String) | Deletes all data in object.