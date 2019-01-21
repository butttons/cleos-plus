const db = require('./low');
const shortid = require('shortid');
const handles = {
    list: (table = 'accounts') => db.get(table).value(),
    getKeys: (account = '') => db.get('accounts').find({ name: account }).value(),
    add: (table = 'accounts', data = {}) => db.get(table).push(data).write(),
    exists: (table = 'accounts', where = { name: 'zolotoken' }) => db.get(table).find(where).value(),
    updateContract: ({ account, contract, result, abi }) => {
        const exists = db.get('contracts').keys().value().includes(account);
        if (!exists) {
            db.set(`contracts.${account}`, []).write();
        }
        const data = {
            id: shortid.generate(),
            time: Date.now(),
            contract,
            abi,
            result,
        };
        db.get(`contracts.${account}`).push(data).write();
        db.get('accounts').find({ name: account }).assign({ currentContract: data.id }).write();
    },
    listAccounts: () => {
        const accounts = handles.list();
        const contracts = db.get('contracts').value();
        return accounts.map((account) => {
            const hasContracts = Object.keys(contracts).includes(account.name);
            const accountContracts = !hasContracts ? 0 : contracts[account.name].length;
            return {
                name: account.name,
                contracts_deployed: accountContracts,
            };
        });
    },
    getContract: (contractName) => {
        const contract = db.get(`contracts.${contractName}`).sortBy('time').reverse().take(1).value();
        return contract[0];
    },
    setConfig: (config) => db.set('config', config).write(),
    eosConfig: db.get('config').value(),
};
module.exports = { db, handles };
