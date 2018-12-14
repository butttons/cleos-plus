const meow = require('meow');
const help = require('./help');
const cli = meow(help, {
    flags: {
        list: {
            type: 'boolean',
            default: false,
            alias: 'l'
        },
        createAccount: {
            type: 'string'
        },
        deployName: {
            type: 'string'
        },
        deployDir: {
            type: 'string'
        },
        deploy: {
            type: 'string',
            alias: 'd'
        },
        init: {
            type: 'boolean',
            default: false,
            alias: 'i'
        },
        config: {
            type: 'string',
            alias: 'c'
        },
        viewConfig: {
            type: 'boolean',
            default: false
        }
    }
});
module.exports = cli;
