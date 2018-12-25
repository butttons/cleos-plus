const cli = require('./meow');
const { handles } = require('./db');
const eosHelpers = require('./eos/helpers');
const { rpc, api } = require('./eos/index')();
const { loggerFactory } = require('./utils');
const logger = loggerFactory('bootstrap');
const fs = require('fs');
const path = require('path');

const utilsFactory = ({ rpc, api }) => ({
    account: async (name) => {
        const data = await rpc.get_account(name).catch((e) => ({ error: e.json || e.message }));
        return data;
    }
});
const utils = utilsFactory({ rpc, api });

const steps = [
    {
        run: async () => {
            const accounts = [ { name: 'zolotokexn', contract: 'eosio.token' } ];
            accounts.forEach(async (acc) => {
                const exists = await utils.account(acc.name);
                console.log('exists', exists);
            });
        }
    }
];

(async () => {
    await steps[0].run();
})();
