'use strict';

// const registerServiceWorker = () => {
//   if (!Reflect.has(navigator, 'serviceWorker')) {
//     console.log('Service workers are not supported');
//     return;
//   }
//   const { serviceWorker } = navigator;
//   serviceWorker.register('./worker.js').then(registration => {
//     if (registration.installing) {
//       console.log('Service worker installing');
//       console.log(registration.installing);
//       return;
//     }
//     if (registration.waiting) {
//       console.log('Service worker installed');
//       console.log(registration.waiting);
//       return;
//     }
//     if (registration.active) {
//       console.log('Service worker active');
//       console.log(registration.active);
//       return;
//     }
//   }).catch(error => {
//     console.log('Registration failed');
//     console.log(error);
//   });
// };

const customerData = [
  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];

const obj = [
  { key1: "1", key2: "a" },
  { key1: "2", key2: "b" },
];

const create = (event) => {
  var db = event.target.result; 
  var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
  objectStore.createIndex("name", "name", { unique: false });
  objectStore.createIndex("email", "email", { unique: true });
  for (var i in customerData) {
    objectStore.add(customerData[i]);
  }
  var oS= db.createObjectStore("kek", { keyPath: "key1" });
  // oS.createIndex("key2", "key2", { unique: false });
  for (var i in obj) {
    oS.add(obj[i]);
  }
  
}
const a = () => {

}

window.addEventListener('load', () => {
  console.log('The page has loaded');
  registerServiceWorker('./worker.js');
  let request = indexedDB.open('ex', 2);
  // request.onupgradeneeded = function(event) {
  //   create(event);
    // var db = event.target.result; 
    // var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
    // objectStore.createIndex("name", "name", { unique: false });
    // objectStore.createIndex("email", "email", { unique: true });
    // for (var i in customerData) {
    //   objectStore.add(customerData[i]);
    // }
  // };
//   request.onerror = function(event) {
//     console.log(event);
//   };
//   request.onsuccess = function(event) {
//     console.log(event.target.result);
//   };
//   setTimeout(function() {
//     console.log('req',request.result);
// }, 100);
});

window.addEventListener('beforeinstallprompt', event => {
  console.log('Installing PWA');
  console.dir({ beforeinstallprompt: event });
});

window.addEventListener('appinstalled', event => {
  console.log('PWA installed');
  console.dir({ appinstalled: event });
});

// const buildAPI = methods => {
//   const api = {};
//   for (const method of methods) {
//     api[method] = (...args) => new Promise((resolve, reject) => {
//       const url = `/api/${method}`;
//       fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(args),
//       }).then(res => {
//         const { status } = res;
//         if (status !== 200) {
//           reject(new Error(`Status Code: ${status}`));
//           return;
//         }
//         resolve(res.json());
//       });
//     });
//   }
//   return api;
// };

const socket = new WebSocket('ws://127.0.0.1:8000/');

const buildAPI = methods => {
  const api = {};
  for (const method of methods) {
    api[method] = (...args) => new Promise(resolve => {
      socket.send(JSON.stringify({ method, args }));
      socket.onmessage = event => {
        const data = JSON.parse(event.data);
        resolve(data);
      };
    });
  }
  return api;
};

const api = buildAPI(['method1', 'method2']);

const btn = document.getElementById('btn');
const viewport = document.getElementById('view');
btn.addEventListener('click', async () => {
  const s1 = await api.method1();
  viewport.innerText += s1;
})
