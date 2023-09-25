import type { Chain } from "../src/types";
export default {
  "chainId": 1197,
  "chain": "IORA",
  "name": "Iora Chain",
  "rpc": [
    "https://iora-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed.iorachain.com"
  ],
  "slug": "iora-chain",
  "icon": {
    "url": "ipfs://bafybeiehps5cqdhqottu2efo4jeehwpkz5rbux3cjxd75rm6rjm4sgs2wi",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Iora",
    "symbol": "IORA",
    "decimals": 18
  },
  "infoURL": "https://iorachain.com",
  "shortName": "iora",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ioraexplorer",
      "url": "https://explorer.iorachain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;