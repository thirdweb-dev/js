import type { Chain } from "../src/types";
export default {
  "chain": "Parex",
  "chainId": 322202,
  "explorers": [
    {
      "name": "Parex Mainnet Explorer",
      "url": "https://scan.parex.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://parex.network",
  "name": "Parex Mainnet",
  "nativeCurrency": {
    "name": "PAREX",
    "symbol": "PRX",
    "decimals": 18
  },
  "networkId": 322202,
  "rpc": [
    "https://322202.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.parex.network"
  ],
  "shortName": "parex",
  "slug": "parex",
  "testnet": false,
  "title": "Parex Mainnet"
} as const satisfies Chain;