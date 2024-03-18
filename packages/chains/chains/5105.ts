import type { Chain } from "../src/types";
export default {
  "chain": "Superloyalty Testnet",
  "chainId": 5105,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.superloyal.com/",
  "name": "Superloyalty Testnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 5105,
  "rpc": [
    "https://5105.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-superloyalty-testnet-1m5gwjbsv1.t.conduit.xyz"
  ],
  "shortName": "superloyalty-testnet",
  "slug": "superloyalty-testnet",
  "testnet": true
} as const satisfies Chain;