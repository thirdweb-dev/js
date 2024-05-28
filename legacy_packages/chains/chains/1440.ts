import type { Chain } from "../src/types";
export default {
  "chain": "LAS",
  "chainId": 1440,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://dev.livingassets.io/",
  "name": "Living Assets Mainnet",
  "nativeCurrency": {
    "name": "LAS",
    "symbol": "LAS",
    "decimals": 18
  },
  "networkId": 1440,
  "rpc": [
    "https://1440.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beta.mainnet.livingassets.io/rpc",
    "https://gamma.mainnet.livingassets.io/rpc"
  ],
  "shortName": "LAS",
  "slug": "living-assets",
  "testnet": false
} as const satisfies Chain;