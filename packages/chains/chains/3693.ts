import type { Chain } from "../src/types";
export default {
  "chain": "EMPIRE",
  "chainId": 3693,
  "explorers": [
    {
      "name": "Empire Explorer",
      "url": "https://explorer.empirenetwork.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.empirenetwork.io/",
  "name": "Empire Network",
  "nativeCurrency": {
    "name": "Empire",
    "symbol": "EMPIRE",
    "decimals": 18
  },
  "networkId": 3693,
  "rpc": [
    "https://3693.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.empirenetwork.io"
  ],
  "shortName": "empire",
  "slug": "empire-network",
  "testnet": false
} as const satisfies Chain;