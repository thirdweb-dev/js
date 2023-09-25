import type { Chain } from "../src/types";
export default {
  "chainId": 668,
  "chain": "JuncaChain",
  "name": "JuncaChain",
  "rpc": [
    "https://juncachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.juncachain.com"
  ],
  "slug": "juncachain",
  "faucets": [],
  "nativeCurrency": {
    "name": "JuncaChain Native Token",
    "symbol": "JGC",
    "decimals": 18
  },
  "infoURL": "https://junca-cash.world",
  "shortName": "junca",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "JuncaScan",
      "url": "https://scan.juncachain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;