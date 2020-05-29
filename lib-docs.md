# Documetation for lib
## WorkerTools
* registerServiceWorker(path, log = true, errorFunction)
* installWorker(files, version)
* interceptFecth(version)
## Db
  Name | Desription
  ---- | ----------
  Db(name, version) | Initialize new database.
  onSuccess(func) | Event which will be triggered when database will be available.
  onError(func) | Event which will be triggered when failed to get access to database.
  onUpgrade(func) | Event which will be triggered on the start
  initializeObject(name, storageMethod, indexes, data(optional)) | Creates object where data will be stored.
  setData(name, data) | Adds data to the object.
  getData(name, key) | Gets data from the object.
  deleteData(name, key) | Deletes data from the object.
  keys(name) | Return keys of all data stored in object.
  async values(name) | Return all values whch stored in object.
  async clearAll(object) | Deletes all data in object.