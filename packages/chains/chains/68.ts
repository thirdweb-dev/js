import type { Chain } from "../src/types";
export default {
  "name": "SoterOne Mainnet",
  "chain": "SOTER",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "SoterOne Mainnet Ether",
    "symbol": "SOTER",
    "decimals": 18
  },
  "infoURL": "https://www.soterone.com",
  "shortName": "SO1",
  "chainId": 68,
  "networkId": 68,
  "testnet": false,
  "slug": "soterone"
} as const satisfies Chain;