import type { Chain } from "../src/types";
export default {
  "chainId": 68,
  "chain": "SOTER",
  "name": "SoterOne Mainnet",
  "rpc": [
    "https://soterone.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.soter.one"
  ],
  "slug": "soterone",
  "faucets": [],
  "nativeCurrency": {
    "name": "SoterOne Mainnet Ether",
    "symbol": "SOTER",
    "decimals": 18
  },
  "infoURL": "https://www.soterone.com",
  "shortName": "SO1",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;