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
  "infoURL": "https://www.nervos.org",
  "name": "Godwoken Mainnet",
  "nativeCurrency": {
    "name": "pCKB",
    "symbol": "pCKB",
    "decimals": 18
  },
  "networkId": 71402,
  "rpc": [
    "https://godwoken.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://71402.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://v1.mainnet.godwoken.io/rpc"
  ],
  "shortName": "gw-mainnet-v1",
  "slug": "godwoken",
  "testnet": false
} as const satisfies Chain;