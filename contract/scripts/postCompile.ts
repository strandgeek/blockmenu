import fs from 'fs';

const CURRENT_BUILD_VERSION="v1";

async function main() {

  const contractBuildJSON = fs.readFileSync('./artifacts/contracts/BlockMenu.sol/BlockMenu.json');
  const contractInfo = JSON.parse(contractBuildJSON.toString());
  
  const contract = {
    abi: contractInfo.abi,
    bytecode: contractInfo.bytecode,
  };
  
  fs.writeFileSync('../webapp/src/contracts/'+ CURRENT_BUILD_VERSION + '.json', JSON.stringify(contract, null, 2));
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
