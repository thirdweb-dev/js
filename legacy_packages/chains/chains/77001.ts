import type { Chain } from "../src/types";
export default {
  "chain": "BORA",
  "chainId": 77001,
  "explorers": [
    {
      "name": "BORAchainscope",
      "url": "https://scope.boraportal.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmccGWJcCzQh3rP6ZMdRyTc7JjtusKnXkoUtGUANQgjNqR",
    "width": 48,
    "height": 48,
    "format": "svg"
  },
  "infoURL": "https://www.boraportal.com",
  "name": "BORAchain mainnet",
  "nativeCurrency": {
    "name": "BORA",
    "symbol": "BORA",
    "decimals": 18
  },
  "networkId": 77001,
  "rpc": [
    "https://77001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-node.api.boraportal.com/bora/mainnet",
    "https://public-node.api.boraportal.io/bora/mainnet"
  ],
  "shortName": "BORAchain",
  "slip44": 8217,
  "slug": "borachain",
  "testnet": false
} as const satisfies Chain;