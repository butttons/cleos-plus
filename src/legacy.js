const { cleos: CLEOS } = require('../eosjs.config');
const { run, spawn } = require('./helpers');

const shell = {
    keyGen: async () => {
        const command = `${CLEOS} create key --to-console`;
        const { success, error } = await run(command);
        if (error) return false;
        const privateKey = success.match(/Private key\: (.*)/)[1];
        const publicKey = success.match(/Public key\: (.*)/)[1];
        return {
            private: privateKey,
            public: publicKey
        };
    },
    walletCreate: async (name) => {
        const command = `${CLEOS} wallet create --to-console -n ${name}`;
        const { success, error } = await run(command);
        if (error) return false;
        const password = success.match(/retrievable.\s+"(.*)"/)[1];
        return { password };
    },
    unlockWallet: async (name, password) => {
        try {
            const command = `${CLEOS} wallet unlock -n ${name}`;
            const child = spawn(command);
            child.on('error', console.error);
        } catch (e) {
            console.error(e);
        }
    },
    accountCreate: async (name) => {
        const keysActive = await shell.keyGen();
        const keysOwner = await shell.keyGen();
        const wallet = await shell.walletCreate(name);
        //console.log('wallet', wallet);
        const unlocked = await shell.unlockWallet(name, wallet.password);
        const command = `${CLEOS} create account eosio ${name} ${keysActive.public} ${keysOwner.public}`;
        //PW5JBsU6WSYbwazL6DDf8zAA62dozUuvD7aNMmSTuuDpXgz2JSbcm
    }
};

(async () => {
    await shell.unlockWallet('zoloone12', 'PW5JBsU6WSYbwazL6DDf8zAA62dozUuvD7aNMmSTuuDpXgz2JSbcm');
})();

module.exports = shell;
