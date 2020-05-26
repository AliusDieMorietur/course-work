class WorkerTools {
  static registerServiceWorker(path, log = true, errorFunction) {
    if (!Reflect.has(navigator, 'serviceWorker')) {
      console.log('Service workers are not supported');
      return;
    }
    const { serviceWorker } = navigator;
    serviceWorker.register(path).then(registration => {
      if (registration.installing) {
        if (log) {
          console.log('Service worker installing');
          console.log(registration.installing);
        }
        return;
      }
      if (registration.waiting) {
        if (log) {
          console.log('Service worker installed');
          console.log(registration.waiting);
        }
        return;
      }
      if (registration.active) {
        if (log) {
          console.log('Service worker active');
          console.log(registration.active);
        }
        return;
      }
    }).catch(error => {
      if (errorFunction) {
        errorFunction(error);
      } else {
        console.log('Registration failed');
        console.log(error);
      }
    });
  };

  static installWorker(files, version) {
    self.addEventListener('install', event => event.waitUntil(caches.open(version).then(cache => cache.addAll(files))));
  }

  static interceptFecth(version) {
    self.addEventListener('fetch', event => {
      event.respondWith(
        caches.match(event.request).then(response => {
        if (response !== undefined) return response;
        return fetch(event.request).then(response => {
          const responseClone = response.clone();
          caches.open(version).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch(error => {
          throw error;
        });
      }));
    });
  }
}

class Db {
  constructor(name, version, errorFunction, successFunction) {
    this.name = name;
    this.version = version;
    this.request = window.indexedDB.open(name, version);
    this.db;
    this.objectsStored = new Map();
  }

  initializeObject(name, storageMethod, indexes, data) {
    const objectStore = this.db.createObjectStore(name, storageMethod);
    this.objectsStored.set(name, objectStore);
    for (const item of indexes) {
      const optionalParameters = item.optionalParameters ? item.optionalParameters : {}; 
      objectStore.createIndex(item.indexName, item.keyPath, optionalParameters);
    };
    if (data) this.addData(name, data);
  }

  setData(name, data) {
    const transaction = this.db.transaction([name], "readwrite");
    const objectStore = transaction.objectStore(name);
    objectStore.add(data);
  }

  getData(name, key) {
    const transaction = this.db.transaction([name]);
    const objectStore = transaction.objectStore(name);
    return objectStore.get(key);
  }

  deleteData(name, key) {
    const transaction = this.db.transaction([name], "readwrite");
    const objectStore = transaction.objectStore(name);
    objectStore.delete(key);
  }

  log() {
    console.log(this.db);
  }
}
