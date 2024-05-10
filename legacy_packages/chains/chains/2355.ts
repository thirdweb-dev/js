import type { Chain } from "../src/types";
export default {
  "chain": "Silicon",
  "chainId": 2355,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTEnk2fosqbY6HQW5vySrLGbopJfeni9ThZ6R9sVefbnq",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "name": "Silicon zkEVM",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2355,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": []
  },
  "rpc": [],
  "shortName": "silicon-zk",
  "slug": "silicon-zkevm",
  "status": "incubating",
  "testnet": false,
  "title": "Silicon zkEVM Mainnet"
} as const satisfies Chain;