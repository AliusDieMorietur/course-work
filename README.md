# Library for PWA

## Concept
The current state of PWA is poor. Many problems, many flaws, not convenient syntax, difficulties in launching a project. This library is designed to solve these problems, facilitate the process of creating PWA, reduce duplicate code, etc. Most methods are focused on indexeddb, since there are the most difficulties.

## Tasks
- [x] Basic Tools for worker
- [x] Basic methods for indexeddb
- [ ] A large set of different methods for working with data inside indexeddb objects
- [ ] Support cursor
- [ ] Make additional methods for service workers.

## Requirements for PWA
* http-server to serve static
* manifest.json
* icon pack

## Documentation
https://github.com/AliusDieMorietur/course-work/blob/master/lib-docs.md

## Usage
### Default
1. Fork and clone this repository or prepare configuration yourself
2. Connect <code>app-lib.js</code> in your html file before your client scripts
3. Use <code>importScripts('./js/app-lib.js')</code>in your worker file and add basic configuration to your worker
4. Initialize db as it shown in [documentation](https://github.com/AliusDieMorietur/course-work/blob/master/lib-docs.md)
5. Run <code>node server.js</code> (prepared server) or set up your own one which can serve static
6. Enjoy basic PWA experience!


### With scv
1. Fork and clone this [repository](https://github.com/AliusDieMorietur/scv)
2. Run <code>scv pwa</code>to set up template for pwa project
3. Register and add basic configuration to your worker 
4. Initialize db as it shown in [documentation](https://github.com/AliusDieMorietur/course-work/blob/master/lib-docs.md)
5. Run project with <code>node server.js</code> and stop with Ctrl+C
6. Enjoy basic PWA experience!


## scv (optional)
Helps to create PWA template
https://github.com/AliusDieMorietur/scv

