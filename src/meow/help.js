module.exports = `
Usage
  $ cleos-plus <input>

Options
  --init,           -i                  Initialize 'jseos.config.json' config file to be edited
  --config,         -c                  Import config file from current working directory. Defaults to: jseos.config.json
  --list,           -l                  List accounts stored
  --deploy,         -d                  Deploy current contract to account
  --create-account                      Create a new account
  --deploy-name                         Account to deploy contract to
  --deploy-dir                          Contract directory
  --view-config                         View config

Testing contract options:
  --test-contract                       Test a contract
  --auth            -a                  Use given account as authorization
  --payload                             Payload in JSON format
  --action                              Name of action to test
  
Examples
  $ cleos-plus -i
  $ cleos-plus -c 
  $ cleos-plus --create-account=mytestacc
  $ cleos-plus --deploy-name=mytestacc --deploy-dir=mytestacc-contract
  $ cleos-plus -d
  $ cleos-plus --deploy=accountname
  $ cleos-plus --test-contract=mytestcontract --action=actionname --payload='["string", 5, 150,  "more string"]' --auth=authaccountname

`;
