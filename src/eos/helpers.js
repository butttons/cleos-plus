const { Keygen } = require('eosjs-keygen');
const { handles } = require('../db');
const eosApiFactory = require('./index');
const deployContract = require('./deploy-contract');
const path = require('path');
const { run, loggerFactory } = require('../utils');
const logger = loggerFactory('eos');
const { createAccountTrx } = require('./transaction-factory');
const fs = require('fs');
const { handles: { eosConfig } } = require('../db/index');
const { exampleGenerator } = require('./example-generator');

const EOS_OWNER_NAME = typeof eosConfig.owner !== 'undefined' ? eosConfig.owner.name : 'eosio';
const EOS_OWNER_AUTH = [
    {
        actor: EOS_OWNER_NAME,
        permission: 'active'
    }
];
const EOS_TAPOS = {
    blocksBehind: 3,
    expireSeconds: 30
};
const hasConnRefused = (result) => result.toString().includes('ECONNREFUSED');
const helpers = {
    createAccount: async (name) => {
        const exists = handles.exists('accounts', { name });
        if (!!exists) {
            logger.warn('Account exists:', exists);
            return false;
        }
        const keys = await Keygen.generateMasterKeys();
        const transaction = createAccountTrx({
            name,
            ownerKey: keys.publicKeys.owner,
            activeKey: keys.publicKeys.active,
            authorization: EOS_OWNER_AUTH,
            ownerName: EOS_OWNER_NAME
        });
        const { api, RpcError } = eosApiFactory();
        const result = await api.transact(transaction, EOS_TAPOS).catch((e) => {
            if (e instanceof RpcError) return { error: e.json };
            return e.message;
        });
        if (typeof result.error !== 'undefined' || hasConnRefused(result)) {
            if (hasConnRefused(result)) {
                logger.error(result);
                return;
            }
            logger.error(result.error);
            console.log(result.error);
            console.log(`cleos create account eosio ${name} ${keys.publicKeys.owner} ${keys.publicKeys.active}`);
        } else {
            handles.add('accounts', {
                name,
                keys
            });
            logger.success('Account created');
            console.log(result);
        }
    },
    compileContract: async (contractDir) => {
        const fullContractDir = path.resolve(__dirname, '..', '..', '..', 'eosio-contracts', contractDir);
        if (!fs.existsSync(fullContractDir)) {
            logger.error('Contract directory does not exist');
            return false;
        }
        const command = `eosio-cpp -abigen ${contractDir}.cpp -o ${contractDir}.wasm`;
        const out = await run(command, { cwd: fullContractDir });
        logger.info('command: ', command);
        if (out.error) {
            logger.error('Error compiling contract:', out.error);
            return false;
        } else {
            logger.success('Compiled contract');
            return true;
        }
    },
    deployContract: async (name, contractDir, noCompile = false) => {
        const exists = handles.exists('accounts', { name });
        if (!exists) {
            logger.warn(`Account '${name}' does not exist. Creating one`);
            await helpers.createAccount(name);
        }
        if (noCompile) {
            logger.warn('Skipping compilation');
        } else {
            const compileSuccess = await helpers.compileContract(contractDir);
            if (!compileSuccess) {
                return false;
            }
        }
        const account = exists;
        const { api, RpcError } = eosApiFactory(account.keys.privateKeys.active);
        const fullContractDir = path.resolve(eosConfig.contractDir, contractDir);
        const { result, transaction, abi } = await deployContract({ api, account: account.name, contractDir: fullContractDir });

        if (typeof result.error !== 'undefined' || hasConnRefused(result)) {
            if (hasConnRefused(result)) {
                logger.error(result);
                return;
            }
            logger.error(result.error);
            console.log(result.error);
        } else {
            if (typeof result.transaction_id !== 'undefined') {
                logger.success('Deployed contract');
                handles.updateContract({ account: name, contract: transaction, result, abi });
                console.log(result);
            } else {
                logger.warn(result);
            }
        }
    },
    testContract: async (contract, auth, data = false) => {
        const contractData = handles.getContract(contract);
        const exampleTransaction = exampleGenerator(auth, contractData.abi, data);
        console.log('exampleTransaction', exampleTransaction[0].cleos);
    }
};

module.exports = helpers;
