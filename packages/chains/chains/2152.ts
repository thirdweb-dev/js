import type { Chain } from "../src/types";
export default {
  "chain": "Findora",
  "chainId": 2152,
  "explorers": [
    {
      "name": "findorascan",
      "url": "https://evm.findorascan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://findora.org/",
  "name": "Findora Mainnet",
  "nativeCurrency": {
    "name": "FRA",
    "symbol": "FRA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://findora.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.findora.org"
  ],
  "shortName": "fra",
  "slug": "findora",
  "testnet": false
} as const satisfies Chain;