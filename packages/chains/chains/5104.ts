import type { Chain } from "../src/types";
export default {
  "chain": "Charmverse Testnet",
  "chainId": 5104,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://charmverse.io/",
  "name": "Charmverse Testnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 5104,
  "rpc": [
    "https://5104.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-charmverse-testnet-g6blnaebes.t.conduit.xyz"
  ],
  "shortName": "charmverse-testnet",
  "slug": "charmverse-testnet",
  "testnet": true
} as const satisfies Chain;