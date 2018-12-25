const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const path = require('path');
const adapter = new FileSync(path.resolve(__dirname, 'db.json'));
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db
    .defaults({
        accounts: [],
        contracts: {},
        config: {}
    })
    .write();
if (!db.get('config').value()) {
    db
        .set('config', {
            api: 'http://localhost:7777',
            contractDir: '',
            owner: {
                name: 'eosio',
                key: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
            }
        })
        .write();
}

module.exports = db;
