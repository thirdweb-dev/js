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
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://reactive.network",
  "name": "Reactive Network Testnet Kopli",
  "nativeCurrency": {
    "name": "React",
    "symbol": "REACT",
    "decimals": 18
  },
  "networkId": 5318008,
  "rpc": [
    "https://5318008.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://kopli-rpc.reactive.network"
  ],
  "shortName": "react",
  "slug": "reactive-network-testnet-kopli",
  "testnet": true
} as const satisfies Chain;