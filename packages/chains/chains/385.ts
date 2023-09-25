import type { Chain } from "../src/types";
export default {
  "chainId": 385,
  "chain": "CRO",
  "name": "Lisinski",
  "rpc": [
    "https://lisinski.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-bitfalls1.lisinski.online"
  ],
  "slug": "lisinski",
  "faucets": [
    "https://pipa.lisinski.online"
  ],
  "nativeCurrency": {
    "name": "Lisinski Ether",
    "symbol": "LISINS",
    "decimals": 18
  },
  "infoURL": "https://lisinski.online",
  "shortName": "lisinski",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;