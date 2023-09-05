import type { Chain } from "../src/types";
export default {
  "name": "JuncaChain",
  "chain": "JuncaChain",
  "rpc": [
    "https://juncachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.juncachain.com"
  ],
  "nativeCurrency": {
    "name": "JuncaChain Native Token",
    "symbol": "JGC",
    "decimals": 18
  },
  "faucets": [],
  "infoURL": "https://junca-cash.world",
  "shortName": "junca",
  "chainId": 668,
  "networkId": 668,
  "explorers": [
    {
      "name": "JuncaScan",
      "url": "https://scan.juncachain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "juncachain"
} as const satisfies Chain;