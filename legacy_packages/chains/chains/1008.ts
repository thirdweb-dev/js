import type { Chain } from "../src/types";
export default {
  "chain": "EUN",
  "chainId": 1008,
  "explorers": [
    {
      "name": "eurusexplorer",
      "url": "https://explorer.eurus.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://eurus.network",
  "name": "Eurus Mainnet",
  "nativeCurrency": {
    "name": "Eurus",
    "symbol": "EUN",
    "decimals": 18
  },
  "networkId": 1008,
  "rpc": [
    "https://1008.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.eurus.network/"
  ],
  "shortName": "eun",
  "slug": "eurus",
  "testnet": false
} as const satisfies Chain;