import type { Chain } from "../src/types";
export default {
  "chain": "fren",
  "chainId": 44444,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://frenscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://frenchain.app",
  "name": "Frenchain",
  "nativeCurrency": {
    "name": "FREN",
    "symbol": "FREN",
    "decimals": 18
  },
  "networkId": 44444,
  "rpc": [
    "https://44444.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-02.frenscan.io"
  ],
  "shortName": "FREN",
  "slug": "frenchain",
  "testnet": false
} as const satisfies Chain;