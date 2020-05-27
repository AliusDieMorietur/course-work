# Library for PWA
## Concept
The current state of PWA is poor. Many problems, many flaws, not convenient syntax, difficulties in launching a project. This library is designed to solve these problems, facilitate the process of creating PWA, reduce duplicate code, etc.
## Tasks
- [x] Basic Tools for worker
- [x] Basic methods for indexeddb
- [ ] A large set of different functions for working with data inside indexeddb objects
## Requirements
* Provided small server to serve static or any other server which can handle this task
## Usage
# Scv
Created to facilitate the creation of PWA projects, it can also create any file hierarchy you need in your custom projects
## Usage
Format "name.extension" for files

Example: typical_file.js 

Format "name {}" for folders

Example: typical_folder {} 
```
main.js; <-- ";" to separate files and folders for current directory
server {
  v1 {
    server.js
  }, <-- "," to separate files and folders for childs
  v2 {
    server.js
  }, <-- "," 
  sample.test
}; <-- ";" 
```
### For custom project 
1. Run from terminal "scv init"  
2. Open template.cfg and write your own template as indicated in the example
3. Run "scv build"
4. Directory has been created
### For PWA 
1. Just run "scv pwa" and choose your options
