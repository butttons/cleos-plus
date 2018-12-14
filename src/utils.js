const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const signale = require('signale');
const fs = require('fs');
const path = require('path');
const { handles: { eosConfig } } = require('./db');

const parseOutput = (output) => {
    const trimmed = output.trim();
    return trimmed[0] === '{' ? JSON.parse(trimmed) : trimmed;
};
const run = async (command, options) => {
    let output = {
        success: false,
        error: false
    };
    try {
        execOutput = await exec(command, options);
        output.success = parseOutput(execOutput.stdout);
    } catch (e) {
        output.error = e.stderr;
    }
    return output;
};

const loggerFactory = (scope) => signale.scope(scope);
const isContractDir = (dir) => {
    const files = fs.readdirSync(dir);
    const currentDir = path.parse(dir);
    const contractName = currentDir.name;
    const hasCpp = files.includes(`${contractName}.cpp`);
    return {
        contractName,
        validDir: hasCpp
    };
};

const initConfig = (fileName = 'jseos.config.json') => {
    const config = {
        api: 'http://localhost:7777',
        contractDir: '',
        owner: {
            name: 'eosio',
            key: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
        }
    };
    const fullPath = path.resolve(process.cwd(), fileName);
    fs.writeFileSync(fullPath, JSON.stringify(config, null, 4));
    return fullPath;
};

const hasConfig = () => {
    const hasContractDir = eosConfig.contractDir.length > 0;
    const hasOwnerName = eosConfig.owner.name.length > 0;
    const hasOwnerKey = eosConfig.owner.key.length > 0;
    return hasContractDir && hasOwnerKey && hasOwnerKey;
};
const noConfigErr = (logger) => {
    logger.error('No config file found. Init by cleos-js -i');
};
module.exports = { run, loggerFactory, isContractDir, initConfig, hasConfig };
