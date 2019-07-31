const chalk = require('chalk');

function printHeader() {
  console.log(chalk.blue(`   ___ ___   ___  ___   ___ _  _____ _____   
  | __|_ _| / __|/ _ \\ / __| |/ / __|_   _|  
  | _| | |  \\__ \\ (_) | (__| ' <| _|  | |    
  |___|___| |___/\\___/ \\___|_|\\_\\___| |_|    
                                            `));

  console.log(chalk.green('     Version 2.0.0 | (c) 2019 BSU SLIM     \n'));
}

module.exports = printHeader;