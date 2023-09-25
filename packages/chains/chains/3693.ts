import type { Chain } from "../src/types";
export default {
  "chainId": 3693,
  "chain": "EMPIRE",
  "name": "Empire Network",
  "rpc": [
    "https://empire-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.empirenetwork.io"
  ],
  "slug": "empire-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Empire",
    "symbol": "EMPIRE",
    "decimals": 18
  },
  "infoURL": "https://www.empirenetwork.io/",
  "shortName": "empire",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Empire Explorer",
      "url": "https://explorer.empirenetwork.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;