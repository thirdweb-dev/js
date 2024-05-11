import type { Chain } from "../src/types";
export default {
  "chain": "Silicon",
  "chainId": 1414,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTEnk2fosqbY6HQW5vySrLGbopJfeni9ThZ6R9sVefbnq",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "name": "Silicon zkEVM Sepolia Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1414,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  },
  "rpc": [],
  "shortName": "silicon-sepolia-testnet",
  "slug": "silicon-zkevm-sepolia-testnet",
  "status": "incubating",
  "testnet": true,
  "title": "Silicon zkEVM Sepolia Testnet"
} as const satisfies Chain;