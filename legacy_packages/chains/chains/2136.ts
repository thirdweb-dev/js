import type { Chain } from "../src/types";
export default {
  "chain": "BIGSB Testnet",
  "chainId": 2136,
  "explorers": [
    {
      "name": "Polkadot.js",
      "url": "https://polkadot.js.org/apps/?rpc=wss://test-market.bigsb.network#/explorer",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://bigshortbets.com/",
  "name": "BigShortBets Testnet",
  "nativeCurrency": {
    "name": "Dolarz",
    "symbol": "Dolarz",
    "decimals": 18
  },
  "networkId": 2136,
  "rpc": [
    "https://2136.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-market.bigsb.network",
    "wss://test-market.bigsb.network"
  ],
  "shortName": "bigsb_testnet",
  "slug": "bigshortbets-testnet",
  "testnet": true
} as const satisfies Chain;