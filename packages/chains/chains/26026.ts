import type { Chain } from "../src/types";
export default {
  "chainId": 26026,
  "chain": "tFRM",
  "name": "Ferrum Testnet",
  "rpc": [
    "https://ferrum-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.dev.svcs.ferrumnetwork.io:9933"
  ],
  "slug": "ferrum-testnet",
  "faucets": [
    "https://testnet.faucet.ferrumnetwork.io"
  ],
  "nativeCurrency": {
    "name": "Ferrum",
    "symbol": "tFRM",
    "decimals": 18
  },
  "infoURL": "https://ferrum.network",
  "shortName": "frm",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "polkadotjs",
      "url": "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ftestnet.dev.svcs.ferrumnetwork.io#/explorer",
      "standard": "none"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;