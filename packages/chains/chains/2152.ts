import type { Chain } from "../src/types";
export default {
  "chainId": 2152,
  "chain": "Findora",
  "name": "Findora Mainnet",
  "rpc": [
    "https://findora.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.findora.org"
  ],
  "slug": "findora",
  "faucets": [],
  "nativeCurrency": {
    "name": "FRA",
    "symbol": "FRA",
    "decimals": 18
  },
  "infoURL": "https://findora.org/",
  "shortName": "fra",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "findorascan",
      "url": "https://evm.findorascan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;