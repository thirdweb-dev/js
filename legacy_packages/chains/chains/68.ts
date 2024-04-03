import type { Chain } from "../src/types";
export default {
  "chain": "SOTER",
  "chainId": 68,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.soterone.com",
  "name": "SoterOne Mainnet",
  "nativeCurrency": {
    "name": "SoterOne Mainnet Ether",
    "symbol": "SOTER",
    "decimals": 18
  },
  "networkId": 68,
  "rpc": [
    "https://68.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.soter.one"
  ],
  "shortName": "SO1",
  "slug": "soterone",
  "testnet": false
} as const satisfies Chain;