import type { Chain } from "../src/types";
export default {
  "chainId": 71402,
  "chain": "GWT",
  "name": "Godwoken Mainnet",
  "rpc": [
    "https://godwoken.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://v1.mainnet.godwoken.io/rpc"
  ],
  "slug": "godwoken",
  "faucets": [],
  "nativeCurrency": {
    "name": "pCKB",
    "symbol": "pCKB",
    "decimals": 18
  },
  "infoURL": "https://www.nervos.org",
  "shortName": "gw-mainnet-v1",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "GWScan Block Explorer",
      "url": "https://v1.gwscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;