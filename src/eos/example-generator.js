const { db, handles } = require('../db/index');
const Chance = require('chance');

const fieldFactory = (fieldType, account) => {
    const chance = new Chance();
    switch (fieldType) {
        case 'name':
            return account;
            break;
        case 'bool':
            return chance.bool();
            break;
        case 'string':
            return chance.string();
            break;
        default:
            if (fieldType.indexOf('int') !== -1) {
                return chance.integer({ min: 10, max: 100 });
            }
            if (fieldType.indexOf('float') !== -1) {
                return chance.floating({ min: 10, max: 100 });
            }
            return fieldType;
    }
};

const transactionFactory = (account, abi, data) => {
    const hasData = data !== false;
    return abi.actions.map((action) => {
        const functionSig = abi.structs.find((struct) => struct.name === action.name);
        const data = functionSig.fields.reduce((acc, field, index) => {
            acc[field.name] = hasData ? data[index] : fieldFactory(field.type, account);
            return acc;
        }, {});
        const transaction = {
            account,
            name: action.name,
            authorization: null,
            data
        };
        return {
            transaction,
            cleos: cleosExample(account, action.name, data, account)
        };
    });
};
const cleosExample = (account, action, data, auth) => {
    return `cleos push action ${account} ${action} '${JSON.stringify(Object.values(data))}' -p ${auth}@active`;
};

const generator = (account, versionId = false) => {
    const accountInfo = db.get('accounts').find({ name: account }).value();
    if (!accountInfo) {
        return;
    }
    const version = versionId ? versionId : accountInfo.currentContract;
    const contract = db.get(`contracts.${account}`).find({ id: version }).value();
    if (!contract) {
        return;
    }
    const abi = contract.abi;
    const example = transactionFactory(account, abi);
    return example;
};

module.exports = { generator, exampleGenerator: transactionFactory };
