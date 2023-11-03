import type { Chain } from "../types";
export default {
  "chain": "tFRM",
  "chainId": 26026,
  "explorers": [
    {
      "name": "polkadotjs",
      "url": "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ftestnet.dev.svcs.ferrumnetwork.io#/explorer",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://testnet.faucet.ferrumnetwork.io"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://ferrum.network",
  "name": "Ferrum Testnet",
  "nativeCurrency": {
    "name": "Ferrum",
    "symbol": "tFRM",
    "decimals": 18
  },
  "networkId": 26026,
  "rpc": [
    "https://ferrum-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://26026.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.dev.svcs.ferrumnetwork.io:9933"
  ],
  "shortName": "frm",
  "slug": "ferrum-testnet",
  "testnet": true
} as const satisfies Chain;