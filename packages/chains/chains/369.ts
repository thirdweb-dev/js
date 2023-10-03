import type { Chain } from "../src/types";
export default {
  "chain": "PLS",
  "chainId": 369,
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
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://pulsechain.com/",
  "name": "PulseChain",
  "nativeCurrency": {
    "name": "Pulse",
    "symbol": "PLS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://pulsechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.pulsechain.com",
    "wss://rpc.pulsechain.com",
    "https://pulsechain.publicnode.com",
    "wss://pulsechain.publicnode.com",
    "https://rpc-pulsechain.g4mm4.io",
    "wss://rpc-pulsechain.g4mm4.io"
  ],
  "shortName": "pls",
  "slug": "pulsechain",
  "status": "active",
  "testnet": false
} as const satisfies Chain;