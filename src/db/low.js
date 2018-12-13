const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const path = require('path');
const adapter = new FileSync(path.resolve(__dirname, 'db.json'));
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ accounts: [], contracts: {}, config: {} }).write();

module.exports = db;
