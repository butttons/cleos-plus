#!/usr/bin/env node
require('console.table');
const cli = require('./meow');
const { handles } = require('./db');
const eos = require('./eos/helpers');
const { isContractDir, loggerFactory, initConfig, hasConfig } = require('./utils');
const logger = loggerFactory('eosjs-helper');
const fs = require('fs');
const path = require('path');

(async () => {
    const flagKeys = Object.keys(cli.flags);
    const configExists = hasConfig();
    const flags = {
        list: cli.flags.list,
        createAccount: flagKeys.includes('createAccount'),
        deployContract: flagKeys.includes('deployName'),
        deployThis: cli.flags.deploy,
        init: cli.flags.init,
        configSet: flagKeys.includes('config'),
        configView: cli.flags.viewConfig
    };
    if (flags.list) {
        const accounts = handles.listAccounts();
        if (accounts.length) {
            logger.success(`Total ${accounts.length} accounts found`);
            console.table(accounts);
        } else {
            logger.warn('No accounts found.');
        }
        return;
    }
    if (flags.createAccount) {
        if (!configExists) {
            noConfigErr(logger);
            return;
        }
        logger.time('create account');
        const accountName = cli.flags.createAccount;
        await eos.createAccount(accountName);
        logger.timeEnd('create account');
        return;
    }
    if (flags.deployContract) {
        if (!configExists) {
            noConfigErr(logger);
            return;
        }
        logger.time('deploy contract');
        const accountName = cli.flags.deployName;
        const contractDir = cli.flags.deployDir ? cli.flags.deployDir : accountName;
        await eos.deployContract(accountName, contractDir);
        logger.timeEnd('deploy contract');
        return;
    }
    if (flags.deployThis) {
        if (!configExists) {
            noConfigErr(logger);
            return;
        }
        logger.time('deploy contract');
        const contractName = isContractDir(process.cwd());
        if (!contractName) {
            logger.warn(`This doesn't appear to be a contract directory. No '${contractName}.cpp' file found.`);
        } else {
            await eos.deployContract(contractName, contractName);
        }
        logger.timeEnd('deploy contract');
        return;
    }
    if (flags.init) {
        const filePath = initConfig();
        logger.success(`Config file created at: ${filePath}`);
        return;
    }
    if (flags.configSet) {
        const configFile = !cli.flags.config.length ? 'jseos.config.json' : cli.flags.config;
        const fullPath = path.resolve(process.cwd(), configFile);
        console.log('fullPath', fullPath);
        if (!fs.existsSync(fullPath)) {
            logger.warn('No config file found');
        } else {
            const configData = fs.readFileSync(fullPath, 'utf8');
            const config = JSON.parse(configData);
            handles.setConfig(JSON.parse(configData));
            logger.success('Saved config data');
            console.log(config);
        }
        return;
    }
    if (flags.configView) {
        logger.info('Config: ');
        console.log(handles.eosConfig);
    }
})();
