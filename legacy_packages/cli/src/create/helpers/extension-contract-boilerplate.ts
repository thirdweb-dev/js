// Import the extension-contract storage boilerplate

export function readExtensionBoilerPlate(name: string): string {
  const snakeCaseName = camelToSnakeCase(name).toUpperCase();
  const dotCaseName = camelToDotCase(name);
  const boilerplate = `// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library ${name}Storage {
  bytes32 public constant ${snakeCaseName}_STORAGE_POSITION = keccak256("${dotCaseName}.storage");

  // Define your contract's state inside the Data struct.
  struct Data {
    // Example: a uint called "number"
    uint256 number;
  }

  /**
    *  Access your state variables using the following pattern (example):
    *  ${name}Storage.Data storage data = ${name}Storage.getStorage();
  **/
  function getStorage() internal pure returns (Data storage data) {
    bytes32 position = ${snakeCaseName}_STORAGE_POSITION;
    assembly {
      data.slot := position
    }
  }
}
  
contract ${name} {

  function readContractState() external view returns (uint256) {
    ${name}Storage.Data storage data = ${name}Storage.getStorage();
    return data.number;
  }

  function writeContractState(uint256 x) external {
    ${name}Storage.Data storage data = ${name}Storage.getStorage();
    data.number = x;
  }
}`;

  return boilerplate;
}

function camelToSymbolCase(text: string, symbol: string): string {
  return text
    .replace(/(.)([A-Z][a-z]+)/, `$1${symbol}$2`)
    .replace(/([a-z0-9])([A-Z])/, `$1${symbol}$2`)
    .toLowerCase();
}

function camelToSnakeCase(text: string): string {
  return camelToSymbolCase(text, "_");
}
function camelToDotCase(text: string): string {
  return camelToSymbolCase(text, ".");
}
