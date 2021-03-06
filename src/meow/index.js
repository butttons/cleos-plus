const meow = require('meow');
const help = require('./help');
const cli = meow(help, {
    flags: {
        list: {
            type: 'boolean',
            default: false,
            alias: 'l',
        },
        viewAccount: {
            type: 'string',
        },
        createAccount: {
            type: 'string',
        },
        deployName: {
            type: 'string',
        },
        deployDir: {
            type: 'string',
        },
        deploy: {
            type: 'string',
            alias: 'd',
        },
        init: {
            type: 'boolean',
            default: false,
            alias: 'i',
        },
        config: {
            type: 'string',
            alias: 'c',
        },
        viewConfig: {
            type: 'boolean',
            default: false,
        },
        example: {
            type: 'string',
            alias: 'e',
        },
        id: {
            type: 'string',
        },
        auth: {
            type: 'string',
            alias: 'a',
        },
        noCompile: {
            type: 'boolean',
            default: false,
        },
        testContract: {
            type: 'string',
        },
        payload: {
            type: 'string',
        },
        action: {
            type: 'string',
        },
    },
});
module.exports = cli;
