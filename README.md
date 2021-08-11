# CouchDB Doc Update 

Customizable script for editing case data in couchdb

## Setup 
- Copy this repository to your own.
- Copy config.defaults.sh to config.sh and update the couchdb connection string, optionally the process name if you are going to have more than one of these running.
- Write your action to each change in the `action.js` file.
- Run `start.sh` to begin. 
