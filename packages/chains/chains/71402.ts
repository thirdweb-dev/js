import type { Chain } from "../src/types";
export default {
  "name": "Godwoken Mainnet",
  "chain": "GWT",
  "rpc": [
    "https://godwoken.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://v1.mainnet.godwoken.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "pCKB",
    "symbol": "pCKB",
    "decimals": 18
  },
  "infoURL": "https://www.nervos.org",
  "shortName": "gw-mainnet-v1",
  "chainId": 71402,
  "networkId": 71402,
  "explorers": [
    {
      "name": "GWScan Block Explorer",
      "url": "https://v1.gwscan.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "godwoken"
} as const satisfies Chain;