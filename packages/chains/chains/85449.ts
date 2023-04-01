import type { Chain } from "../src/types";
export default {
  "name": "CYBERTRUST",
  "chain": "CYBER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Cyber Trust",
    "symbol": "CYBER",
    "decimals": 18
  },
  "infoURL": "https://cybertrust.space",
  "shortName": "Cyber",
  "chainId": 85449,
  "networkId": 48501,
  "testnet": true,
  "slug": "cybertrust"
} as const satisfies Chain;