const { Api, JsonRpc, RpcError, JsSignatureProvider } = require('eosjs');
const fetch = require('node-fetch');
const { TextDecoder, TextEncoder } = require('text-encoding');

const DEFAULT_PRIVATE_KEY = '5JZZKiMKAcCnRZwzJNtBejE2Wq4M4ynLmzvbSJXJhsFeEdRnALy'; // zolotestmain

const EOS_API_ENDPOINT = 'http://localhost:7777';

const signatureProvider = new JsSignatureProvider([ DEFAULT_PRIVATE_KEY ]);
const rpc = new JsonRpc(EOS_API_ENDPOINT, { fetch });

//cleost push action eosio.token transfer '["zolotestmain", "xzoloescrowx", "100.000000 ZOLO", "memo"]' -d -j -p zolotestmain@active

const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
(async () => {
    const balance = await rpc.get_currency_balance('zolotoken', 'zolo', 'ZOLO');
    console.log(balance);
    const stats = await rpc.get_currency_stats('zolotoken', 'ZOLO');
    console.log(stats);
    /*
    const issue = await api
        .transact(
            {
                actions: [
                    {
                        account: 'zolotoken',
                        name: 'issue',
                        authorization: [
                            {
                                actor: 'zolotoken',
                                permission: 'active'
                            }
                        ],
                        data: {
                            to: 'zolo',
                            quantity: '1000.00 ZOLO',
                            memo: 'init'
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 30
            }
        )
        .catch((e) => {
            console.log(e);
        });
    console.log(issue);
    */
    /*
    const create = await api
        .transact(
            {
                actions: [
                    {
                        account: 'zolotoken',
                        name: 'create',
                        authorization: [
                            {
                                actor: 'zolotoken',
                                permission: 'active'
                            }
                        ],
                        data: {
                            issuer: 'zolotoken',
                            maximum_supply: '1000000000.00 ZOLO'
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 30
            }
        )
        .catch((e) => {
            console.log(e);
        });
    console.log('result', issue);
    */
    /*
    const balance = await rpc.get_currency_balance('zolotestmain', 'zolotestmain', 'ZOLO');
    console.log(balance);
    const stats = await rpc.get_currency_stats('zolotestmain', 'ZOLO');
    console.log(stats);
*/
})();
