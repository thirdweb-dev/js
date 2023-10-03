import type { Chain } from "../src/types";
export default {
  "chain": "GWT",
  "chainId": 71402,
  "explorers": [
    {
      "name": "GWScan Block Explorer",
      "url": "https://v1.gwscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.nervos.org",
  "name": "Godwoken Mainnet",
  "nativeCurrency": {
    "name": "pCKB",
    "symbol": "pCKB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://godwoken.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://v1.mainnet.godwoken.io/rpc"
  ],
  "shortName": "gw-mainnet-v1",
  "slug": "godwoken",
  "testnet": false
} as const satisfies Chain;