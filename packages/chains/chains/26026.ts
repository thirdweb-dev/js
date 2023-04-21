import type { Chain } from "../src/types";
export default {
  "name": "Ferrum Testnet",
  "chain": "tFRM",
  "rpc": [
    "https://ferrum-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.dev.svcs.ferrumnetwork.io:9933"
  ],
  "faucets": [
    "https://testnet.faucet.ferrumnetwork.io"
  ],
  "nativeCurrency": {
    "name": "Ferrum",
    "symbol": "tFRM",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://ferrum.network",
  "shortName": "frm",
  "chainId": 26026,
  "networkId": 26026,
  "explorers": [
    {
      "name": "polkadotjs",
      "url": "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ftestnet.dev.svcs.ferrumnetwork.io#/explorer",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "ferrum-testnet"
} as const satisfies Chain;