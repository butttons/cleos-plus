const { Api, JsonRpc, RpcError, JsSignatureProvider } = require('eosjs');
const fetch = require('node-fetch');
const { TextDecoder, TextEncoder } = require('text-encoding');

const {
    handles: { eosConfig },
} = require('../db/index');
const EOS_API_ENDPOINT = eosConfig.api;
const rpc = new JsonRpc(EOS_API_ENDPOINT, { fetch });

module.exports = (DEFAULT_PRIVATE_KEY = eosConfig.owner.key) => {
    const signatureProvider = new JsSignatureProvider([DEFAULT_PRIVATE_KEY]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    return { api, rpc, RpcError };
};
