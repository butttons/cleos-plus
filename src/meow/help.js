module.exports = `
Usage
  $ cleos-js <input>

Options
  --init,           -i                  Initialize 'jseos.config.json' config file to be edited
  --config,         -c                  Import config file from current working directory. Defaults to: jseos.config.json
  --list,           -l                  List accounts stored
  --deploy,         -d                  Deploy current contract to account
  --create-account                      Create a new account
  --deploy-name                         Account to deploy contract to
  --deploy-dir                          Contract directory
  --view-config                         View config

Examples
  $ cleos-js -i
  $ cleos-js -c 
  $ cleos-js --create-account=mytestacc
  $ cleos-js --deploy-name=mytestacc --deploy-dir=mytestacc-contract
  $ cleos-js -d

`;
