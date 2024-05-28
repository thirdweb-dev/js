import type { Chain } from "../src/types";
export default {
  "chain": "LN",
  "chainId": 998,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.luckynetwork.org",
      "standard": "none"
    },
    {
      "name": "expedition",
      "url": "https://lnscan.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://luckynetwork.org",
  "name": "Lucky Network",
  "nativeCurrency": {
    "name": "Lucky",
    "symbol": "L99",
    "decimals": 18
  },
  "networkId": 998,
  "rpc": [
    "https://998.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.luckynetwork.org",
    "wss://ws.lnscan.org",
    "https://rpc.lnscan.org"
  ],
  "shortName": "ln",
  "slug": "lucky-network",
  "testnet": false
} as const satisfies Chain;