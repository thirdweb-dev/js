import type { Chain } from "../src/types";
export default {
  "chainId": 26863,
  "chain": "OasisChain",
  "name": "OasisChain Mainnet",
  "rpc": [
    "https://oasischain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.oasischain.io",
    "https://rpc2.oasischain.io",
    "https://rpc3.oasischain.io"
  ],
  "slug": "oasischain",
  "faucets": [
    "http://faucet.oasischain.io"
  ],
  "nativeCurrency": {
    "name": "OAC",
    "symbol": "OAC",
    "decimals": 18
  },
  "infoURL": "https://scan.oasischain.io",
  "shortName": "OAC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "OasisChain Explorer",
      "url": "https://scan.oasischain.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;