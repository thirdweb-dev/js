import type { Chain } from "../src/types";
export default {
  "chain": "PSC",
  "chainId": 6999,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.polysmartchain.com/",
  "name": "PolySmartChain",
  "nativeCurrency": {
    "name": "PSC",
    "symbol": "PSC",
    "decimals": 18
  },
  "networkId": 6999,
  "rpc": [
    "https://6999.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed0.polysmartchain.com/",
    "https://seed1.polysmartchain.com/",
    "https://seed2.polysmartchain.com/"
  ],
  "shortName": "psc",
  "slug": "polysmartchain",
  "testnet": false
} as const satisfies Chain;