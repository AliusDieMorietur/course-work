# Library for PWA

## Concept
The current state of PWA is poor. Many problems, many flaws, not convenient syntax, difficulties in launching a project. This library is designed to solve these problems, facilitate the process of creating PWA, reduce duplicate code, etc. Most methods are focused on indexeddb, since there are the most difficulties.

## Tasks
- [x] Basic Tools for worker
- [x] Basic methods for indexeddb
- [x] Set of different methods for working with data inside indexeddb objects
- [x] Support cursor
- [ ] Make additional methods for service workers
- [ ] Make some changes in PWA creation process
- [ ] Write test

## Requirements for PWA
* http-server to serve static
* manifest.json
* icon pack

## Documentation
https://github.com/AliusDieMorietur/course-work/blob/master/lib-docs.md

## Usage
### Default
* Option 1
1. Fork or clone this repository[https://github.com/AliusDieMorietur/course-work]
2. Run <code>node server.js</code> (prepared server) 
3. Customize provided example
4. Enjoy basic PWA experience!
---
* Option 2
1. Prepare directory and all files needed
2. Copy <code>app-lib.js</code> and connect it in your html file before your client scripts
4. Configure worker and db as it shown in [documentation](https://github.com/AliusDieMorietur/course-work/blob/master/lib-docs.md)
5. Use any server which can serve static
6. Use methods provided
7. Enjoy!


### With scv
1. Follow instructions as shown in this [repository](https://github.com/AliusDieMorietur/scv)
2. Run <code>scv pwa</code>to set up template for pwa project
3. Register and add basic configuration to your worker 
4. Initialize db as it shown in [documentation](https://github.com/AliusDieMorietur/course-work/blob/master/lib-docs.md)
5. Run project with <code>node server.js</code> and stop with Ctrl+C
6. Enjoy basic PWA experience!


## scv (optional)
Helps to create PWA template
https://github.com/AliusDieMorietur/scv

