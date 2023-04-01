const fs = require('fs');

const CURRENT_BUILD_VERSION="v1";

const contractBuildJSON = fs.readFileSync('./build/contracts/BlockMenu.json');
const contractInfo = JSON.parse(contractBuildJSON);

const contract = {
  abi: contractInfo.abi,
  bytecode: contractInfo.bytecode,
};

fs.writeFileSync('./webapp/src/contracts/'+ CURRENT_BUILD_VERSION + '.json', JSON.stringify(contract, null, 2));
