const db = require('./low');
const handles = {
    list: (table = 'accounts') => db.get(table).value(),
    add: (table = 'accounts', data = {}) => db.get(table).push(data).write(),
    exists: (table = 'accounts', where = { name: 'zolotoken' }) => db.get(table).find(where).value(),
    updateContract: ({ account, contract }) => {
        const exists = db.get('contracts').keys().value().includes(account);
        if (!exists) {
            db.set(`contracts.${account}`, []).write();
        }
        db.get(`contracts.${account}`).push(contract).write();
    },
    listAccounts: () => {
        const accounts = handles.list();
        const contracts = db.get('contracts').value();
        return accounts.map((account) => {
            const hasContracts = Object.keys(contracts).includes(account.name);
            const accountContracts = !hasContracts ? 0 : contracts[account.name].length;
            return {
                name: account.name,
                contracts_deployed: accountContracts
            };
        });
    },
    setConfig: (config) => db.set('config', config).write(),
    eosConfig: db.get('config').value()
};
module.exports = { db, handles };
