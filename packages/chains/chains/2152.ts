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
  "infoURL": "https://findora.org/",
  "name": "Findora Mainnet",
  "nativeCurrency": {
    "name": "FRA",
    "symbol": "FRA",
    "decimals": 18
  },
  "networkId": 2152,
  "rpc": [
    "https://2152.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.findora.org"
  ],
  "shortName": "fra",
  "slug": "findora",
  "testnet": false
} as const satisfies Chain;