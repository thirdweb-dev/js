import type { Chain } from "../src/types";
export default {
  "chain": "CYBER",
  "chainId": 85449,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://cybertrust.space",
  "name": "CYBERTRUST",
  "nativeCurrency": {
    "name": "Cyber Trust",
    "symbol": "CYBER",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://cybertrust.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.cybertrust.space:48501"
  ],
  "shortName": "Cyber",
  "slug": "cybertrust",
  "testnet": true
} as const satisfies Chain;