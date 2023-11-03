import type { Chain } from "../types";
export default {
  "chain": "SOTER",
  "chainId": 218,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.soterone.com",
  "name": "SoterOne Mainnet old",
  "nativeCurrency": {
    "name": "SoterOne Mainnet Ether",
    "symbol": "SOTER",
    "decimals": 18
  },
  "networkId": 218,
  "rpc": [
    "https://soterone-old.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://218.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.soter.one"
  ],
  "shortName": "SO1-old",
  "slug": "soterone-old",
  "status": "deprecated",
  "testnet": false
} as const satisfies Chain;