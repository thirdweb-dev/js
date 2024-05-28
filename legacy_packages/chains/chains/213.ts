import type { Chain } from "../src/types";
export default {
  "chain": "B2",
  "chainId": 213,
  "explorers": [
    {
      "name": "B2 Hub Mainnet Explorer",
      "url": "https://hub-explorer.bsquared.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.bsquared.network",
  "name": "B2 Hub Mainnet",
  "nativeCurrency": {
    "name": "BSquared Token",
    "symbol": "B2",
    "decimals": 18
  },
  "networkId": 213,
  "rpc": [
    "https://213.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://hub-rpc.bsquared.network"
  ],
  "shortName": "B2Hub-mainnet",
  "slug": "b2-hub",
  "testnet": false
} as const satisfies Chain;