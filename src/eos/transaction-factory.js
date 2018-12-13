const createAccountTrx = ({ name, ownerKey, activeKey, authorization, ownerName }) => ({
    actions: [
        {
            account: 'eosio',
            name: 'newaccount',
            authorization,
            data: {
                creator: ownerName,
                name,
                owner: {
                    threshold: 1,
                    keys: [
                        {
                            key: ownerKey,
                            weight: 1
                        }
                    ],
                    accounts: [],
                    waits: []
                },
                active: {
                    threshold: 1,
                    keys: [
                        {
                            key: activeKey,
                            weight: 1
                        }
                    ],
                    accounts: [],
                    waits: []
                }
            }
        }
    ]
});
const deployContractTrx = ({ ownerName, wasm, abiBuffer }) => ({
    actions: [
        {
            account: 'eosio',
            name: 'setcode',
            authorization: [
                {
                    actor: ownerName,
                    permission: 'active'
                }
            ],
            data: {
                account: ownerName,
                vmtype: 0,
                vmversion: 0,
                code: wasm
            }
        },
        {
            account: 'eosio',
            name: 'setabi',
            authorization: [
                {
                    actor: ownerName,
                    permission: 'active'
                }
            ],
            data: {
                account: ownerName,
                abi: abiBuffer
            }
        }
    ]
});
module.exports = { createAccountTrx, deployContractTrx };
