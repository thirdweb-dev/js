import type { Chain } from "../src/types";
export default {
  "chainId": 369,
  "chain": "PLS",
  "name": "PulseChain",
  "rpc": [
    "https://pulsechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.pulsechain.com",
    "wss://rpc.pulsechain.com",
    "https://pulsechain.publicnode.com",
    "wss://pulsechain.publicnode.com",
    "https://rpc-pulsechain.g4mm4.io",
    "wss://rpc-pulsechain.g4mm4.io"
  ],
  "slug": "pulsechain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Pulse",
    "symbol": "PLS",
    "decimals": 18
  },
  "infoURL": "https://pulsechain.com/",
  "shortName": "pls",
  "testnet": false,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "otterscan",
      "url": "https://otter.pulsechain.com",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://scan.pulsechain.com",
      "standard": "EIP3091"
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