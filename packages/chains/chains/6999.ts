import type { Chain } from "../src/types";
export default {
  "chainId": 6999,
  "chain": "PSC",
  "name": "PolySmartChain",
  "rpc": [
    "https://polysmartchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed0.polysmartchain.com/",
    "https://seed1.polysmartchain.com/",
    "https://seed2.polysmartchain.com/"
  ],
  "slug": "polysmartchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "PSC",
    "symbol": "PSC",
    "decimals": 18
  },
  "infoURL": "https://www.polysmartchain.com/",
  "shortName": "psc",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;