const registerServiceWorker = (path, log = true, errorFunction) => {
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

const installWorker = (files, version) => {
  self.addEventListener('install', event => event.waitUntil(caches.open(version).then(cache => cache.addAll(files))));
}

const interceptFecth = (version) => {
  self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(response => {
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
