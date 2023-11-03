import type { Chain } from "../types";
export default {
  "chain": "CYBER",
  "chainId": 85449,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://cybertrust.space",
  "name": "CYBERTRUST",
  "nativeCurrency": {
    "name": "Cyber Trust",
    "symbol": "CYBER",
    "decimals": 18
  },
  "networkId": 48501,
  "rpc": [
    "https://cybertrust.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://85449.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.cybertrust.space:48501"
  ],
  "shortName": "Cyber",
  "slug": "cybertrust",
  "testnet": true
} as const satisfies Chain;