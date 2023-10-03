import type { Chain } from "../src/types";
export default {
  "chain": "CRO",
  "chainId": 385,
  "explorers": [],
  "faucets": [
    "https://pipa.lisinski.online"
  ],
  "features": [],
  "infoURL": "https://lisinski.online",
  "name": "Lisinski",
  "nativeCurrency": {
    "name": "Lisinski Ether",
    "symbol": "LISINS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://lisinski.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-bitfalls1.lisinski.online"
  ],
  "shortName": "lisinski",
  "slug": "lisinski",
  "testnet": false
} as const satisfies Chain;