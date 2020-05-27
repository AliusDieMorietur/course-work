# Documetation for scv
## syntax
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