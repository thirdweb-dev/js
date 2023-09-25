import type { Chain } from "../src/types";
export default {
  "chainId": 85449,
  "chain": "CYBER",
  "name": "CYBERTRUST",
  "rpc": [
    "https://cybertrust.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.cybertrust.space:48501"
  ],
  "slug": "cybertrust",
  "faucets": [],
  "nativeCurrency": {
    "name": "Cyber Trust",
    "symbol": "CYBER",
    "decimals": 18
  },
  "infoURL": "https://cybertrust.space",
  "shortName": "Cyber",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;