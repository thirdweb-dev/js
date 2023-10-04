import type { Chain } from "../src/types";
export default {
  "chain": "OasisChain",
  "chainId": 26863,
  "explorers": [
    {
      "name": "OasisChain Explorer",
      "url": "https://scan.oasischain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://faucet.oasischain.io"
  ],
  "features": [],
  "infoURL": "https://scan.oasischain.io",
  "name": "OasisChain Mainnet",
  "nativeCurrency": {
    "name": "OAC",
    "symbol": "OAC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://oasischain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.oasischain.io",
    "https://rpc2.oasischain.io",
    "https://rpc3.oasischain.io"
  ],
  "shortName": "OAC",
  "slug": "oasischain",
  "testnet": false
} as const satisfies Chain;