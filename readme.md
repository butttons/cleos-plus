# cleos-js
A helper tool to help develop EOS smart contracts.

## Installation:

```
npm i -g cleos-js
```

## Why?
Deploying a smart contract for development involves a lot of steps, which are fairly mundane. This tool will help you with some of the plumbing. 
You can use this tool to speed up your development process. To deploy a contract, you simply need to create the cpp files and, this will handle the compiling and deployment part for you.

## Prerequisites:
- Locally running eosio node. More info on how to get started here - [EOS Docker Quickstart](https://developers.eos.io/eosio-nodeos/docs/docker-quickstart).
- [eosio.cdt](https://github.com/EOSIO/eosio.cdt).
- *Optional. You can use the default eosio development keys provided too.* One account on the blockchain. [How to create an account](https://developers.eos.io/eosio-home/docs/accounts-1).


## How to use:
- Create a config file first by `cleos-js -i`
- Edit the file: 
```
{
    "api": "http://localhost:7777", // The HTTP endpoint for EOS node
    "contractDir": "", // Absolute path to the directory having contracts
    "owner": {
        "name": "", // Account name
        "key": "" // Account private key
    }
}
```
- Import changes by `cleos-js -c`
- Verify that the config has been imported by `cleos-js --view-config`

## Contracts directory:
This directory has all the smart contracts. To create a new contract named `hello`, create a directory named `hello` in your given contracts dir. It must contain a `hello.cpp` file in the root, in order to be compiled by `eosio-cpp`.

## Usage:
- Create a new account:
```
cleos-js --create-account=helloworld
```

- Deploy a contract to an account:
```
cleos-js --deploy-name=helloworld --deploy-dir=helloworld
```
If you omit the `--deploy-dir` param, it will assume the contract directory name to be same as the `--deploy-name`.
If `--deploy-name` account doesn't exist, it will create one.

- Deploy current working directory contract to an account:
```
cleos-js -d=accountname
```
This will deploy the contract in the current working directory. If left blank, the account name will be assumed as the directory name.


