const fs = require(`fs`);
const path = require(`path`);
const { Serialize, RpcError } = require(`eosjs`);
const { deployContractTrx } = require('./transaction-factory');
// Inspired from: https://cmichel.io/setcode-and-setabi-with-eos-js/

function getDeployableFilesFromDir(dir) {
    const dirCont = fs.readdirSync(dir);
    const wasmFileName = dirCont.find((filePath) => filePath.match(/.*\.(wasm)$/gi));
    const abiFileName = dirCont.find((filePath) => filePath.match(/.*\.(abi)$/gi));
    if (!wasmFileName) throw new Error(`Cannot find a ".wasm file" in ${dir}`);
    if (!abiFileName) throw new Error(`Cannot find an ".abi file" in ${dir}`);
    return {
        wasmPath: path.join(dir, wasmFileName),
        abiPath: path.join(dir, abiFileName)
    };
}

async function deployContract({ api, account, contractDir }) {
    const { wasmPath, abiPath } = getDeployableFilesFromDir(contractDir);

    const wasm = fs.readFileSync(wasmPath).toString(`hex`);
    const buffer = new Serialize.SerialBuffer({
        textEncoder: api.textEncoder,
        textDecoder: api.textDecoder
    });

    let abi = JSON.parse(fs.readFileSync(abiPath, `utf8`));
    const abiDefinition = api.abiTypes.get(`abi_def`);
    abi = abiDefinition.fields.reduce((acc, { name: fieldName }) => Object.assign(acc, { [fieldName]: acc[fieldName] || [] }), abi);
    abiDefinition.serialize(buffer, abi);

    const abiBuffer = Buffer.from(buffer.asUint8Array()).toString(`hex`);
    const transaction = deployContractTrx({ ownerName: account, wasm, abiBuffer });

    const result = await api
        .transact(transaction, {
            blocksBehind: 3,
            expireSeconds: 30
        })
        .catch((e) => {
            if (e instanceof RpcError) return { error: e.json };
            return { error: e.message };
        });

    return { result, transaction, abi };
}
module.exports = deployContract;
