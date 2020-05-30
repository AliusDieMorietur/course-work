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

  static install(files, version) {
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
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.request = window.indexedDB.open(name, version);
    this.db;
    this.onSuccess;
    this.onUpgrade;
    this.onError;
  }

  set onSuccess(func) {
    this.request.onsuccess = event => {
      this.db = event.target.result;
      func(event);
    }
  }
  
  set onError(func) {
    this.request.onerror = event => {
      func(event);
    }
  }

  set onUpgrade(func) {
    this.request.onupgradeneeded = event => {
      this.db = event.target.result;
      func(event);
    }
  }

  getIndex(name, indexName) {
    const objectStore = this.getObject(name);
    const index = objectStore.index(indexName);
    return index;
  }

  initializeObject(name, storageMethod, indexes) {
    const objectStore = this.db.createObjectStore(name, storageMethod);
    for (const item of indexes) {
      const optionalParameters = item.optionalParameters ? item.optionalParameters : {}; 
      objectStore.createIndex(item.indexName, item.keyPath, optionalParameters);
    };
  }

  setData(name, data) {
    const objectStore = this.getObject(name);
    objectStore.add(data);
  }

  getData(name, key) {
    const objectStore = this.getObject(name);
    const data = new Promise((resolve, reject) => {
      objectStore.get(key).onsuccess = event => {
        const result = event.srcElement.result;
        if (result) {
          resolve(result);
        } else {
          reject('no data');
        }
      };
    });
    return data;
  }

  deleteData(name, key) {
    const objectStore = this.getObject(name);
    objectStore.delete(key);
  }
  
  async clearAll(name) {
    const keys = await this.keys(name);
    for await (const key of keys) {
      this.deleteData(name, key);
    }
  }

  has(name, key) {
    const objectStore = this.getObject(name);
    const availability = new Promise((resolve, reject) => {
      objectStore.get(key).onsuccess = event => {
        const result = event.srcElement.result;
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
    });
    return availability;
  }
  
  openTransaction(name) {
    return this.db.transaction(name);
  }

  getObject(name) {
    const transaction = this.db.transaction([name], 'readwrite');
    const objectStore = transaction.objectStore(name);
    return objectStore;
  }

  openCursor(name) {
    const objectStore = this.getObject(name);
    return {
      set onSuccess(func) {
        objectStore.openCursor().onsuccess = event => {
          const cursor = event.target.result;
          func(cursor);
        }
      } 
    }
  }

  openIndexCursor(name, indexName) {
    const objectStore = this.getObject(name);
    const index = objectStore.index(indexName);
    return {
      set onSuccess(func) {
        index.openCursor().onsuccess = event => {
          const cursor = event.target.result;
          func(cursor);
        };
      }
    }
  }

  openIndexKeyCursor(name, indexName) {
    const objectStore = this.getObject(name);
    const index = objectStore.index(indexName);
    return {
      set onSuccess(func) {
        index.openKeyCursor().onsuccess = event => {
          const cursor = event.target.result;
          func(cursor);
        };
      }
    }
  }

  keys(name) {
    const objectStore = this.getObject(name);
    const keys = new Promise((resolve, reject) => {
      objectStore.getAllKeys().onsuccess = event => {
        resolve(event.srcElement.result);
      };
    });
    return keys;
  }

  async values(name) {
    const keys = await this.keys(name);
    const result = [];
    for await (const key of keys) {
      const data = await this.getData(name, key);
      result.push(data);
    }
    return result;
  }
}
