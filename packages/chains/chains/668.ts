import type { Chain } from "../src/types";
export default {
  "chain": "JuncaChain",
  "chainId": 668,
  "explorers": [
    {
      "name": "JuncaScan",
      "url": "https://scan.juncachain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://junca-cash.world",
  "name": "JuncaChain",
  "nativeCurrency": {
    "name": "JuncaChain Native Token",
    "symbol": "JGC",
    "decimals": 18
  },
  "networkId": 668,
  "rpc": [
    "https://668.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.juncachain.com"
  ],
  "shortName": "junca",
  "slug": "juncachain",
  "testnet": false
} as const satisfies Chain;