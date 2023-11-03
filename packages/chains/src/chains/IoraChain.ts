import type { Chain } from "../types";
export default {
  "chain": "IORA",
  "chainId": 1197,
  "explorers": [
    {
      "name": "ioraexplorer",
      "url": "https://explorer.iorachain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeiehps5cqdhqottu2efo4jeehwpkz5rbux3cjxd75rm6rjm4sgs2wi",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "infoURL": "https://iorachain.com",
  "name": "Iora Chain",
  "nativeCurrency": {
    "name": "Iora",
    "symbol": "IORA",
    "decimals": 18
  },
  "networkId": 1197,
  "rpc": [
    "https://iora-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1197.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed.iorachain.com"
  ],
  "shortName": "iora",
  "slug": "iora-chain",
  "testnet": false
} as const satisfies Chain;