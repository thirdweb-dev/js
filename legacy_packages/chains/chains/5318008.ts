import type { Chain } from "../src/types";
export default {
  "chain": "REACT",
  "chainId": 5318008,
  "explorers": [
    {
      "name": "reactscan",
      "url": "https://kopli.reactscan.net",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://dev.reactive.network/docs/kopli-testnet#faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmZewyubd3zC17pmmGbjix6gFsppYpLsP3ntu3aB7rCJmW",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://reactive.network",
  "name": "Reactive Kopli",
  "nativeCurrency": {
    "name": "Kopli React",
    "symbol": "REACT",
    "decimals": 18
  },
  "networkId": 5318008,
  "rpc": [
    "https://5318008.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://kopli-rpc.reactive.network",
    "http://kopli-rpc.rkt.ink"
  ],
  "shortName": "kreact",
  "slug": "reactive-kopli",
  "testnet": true,
  "title": "Reactive Network Testnet Kopli"
} as const satisfies Chain;