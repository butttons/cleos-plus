#!/usr/bin/env node
require('console.table');
const cli = require('./meow');
const { handles } = require('./db');
const eos = require('./eos/helpers');
const abiGenerator = require('./eos/example-generator');
const { isContractDir, loggerFactory, initConfig, hasConfig, noConfigErr } = require('./utils');
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
        deployThis: flagKeys.includes('deploy'),
        init: cli.flags.init,
        configSet: flagKeys.includes('config'),
        configView: cli.flags.viewConfig,
        example: flagKeys.includes('example')
    };
    if (flags.list) {
        const accounts = handles.listAccounts();
        if (accounts.length) {
            logger.success(`Total ${accounts.length} accounts found.`);
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
        const noCompile = cli.flags.noCompile;
        const accountName = cli.flags.deployName;
        const contractDir = cli.flags.deployDir ? cli.flags.deployDir : accountName;
        await eos.deployContract(accountName, contractDir, noCompile);
        logger.timeEnd('deploy contract');
        return;
    }
    if (flags.deployThis) {
        if (!configExists) {
            noConfigErr(logger);
            return;
        }
        logger.time('deploy contract');
        const accountName = cli.flags.deploy;
        const accountNameProvided = accountName.length > 0;
        const { validDir, contractName } = isContractDir(process.cwd());
        const deployAccount = accountNameProvided ? accountName : contractName;
        if (!validDir) {
            logger.warn(`This doesn't appear to be a contract directory. No '${contractName}.cpp' file found.`);
        } else {
            logger.info(`Deploying to account: ${deployAccount}`);
            await eos.deployContract(deployAccount, contractName);
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
        return;
    }
    if (flags.example) {
        const contractName = cli.flags.example;
        console.log('contractName', contractName);
        const authAccount = typeof cli.flags.auth !== 'undefined' ? cli.flags.auth : contractName;
        console.log('authAccount', authAccount);
        await eos.testContract(contractName, authAccount);
        //abiGenerator('zolotable');
    }
})();
