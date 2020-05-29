# Library for PWA

## Concept
The current state of PWA is poor. Many problems, many flaws, not convenient syntax, difficulties in launching a project. This library is designed to solve these problems, facilitate the process of creating PWA, reduce duplicate code, etc.

## Tasks
- [x] Basic Tools for worker
- [x] Basic methods for indexeddb
- [ ] A large set of different functions for working with data inside indexeddb objects
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
2. Connect ~~app-lib.js~~ in your html file before your client scripts
3. Use ~~importScripts('./js/app-lib.js')~~ in your worker file and add basic configuration to your worker
4. Initialize db as it shown in documentation
5. Run ~~node server.js~~ (prepared server) or set up your own one which can serve static
6. Enjoy basic PWA experience!


### With scv
1. Fork and clone this repository https://github.com/AliusDieMorietur/scv
2. Run ~~scv pwa~~ 
3. Add basic configuration to your worker 
4. Initialize db as it shown in documentation
5. Run project with node ~~server.js~~ and stop with Ctrl+C
6. Enjoy basic PWA experience!


## Scv (optional)
Helps to create PWA template
https://github.com/AliusDieMorietur/scv

