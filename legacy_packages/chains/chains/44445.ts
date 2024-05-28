import type { Chain } from "../src/types";
export default {
  "chain": "Quantum",
  "chainId": 44445,
  "explorers": [
    {
      "name": "Quantum Explorer",
      "url": "https://qtm.avescoin.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://avescoin.io/",
  "name": "Quantum Network",
  "nativeCurrency": {
    "name": "Quantum",
    "symbol": "QTM",
    "decimals": 18
  },
  "networkId": 44445,
  "rpc": [
    "https://44445.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcqtm.avescoin.io"
  ],
  "shortName": "QTM",
  "slug": "quantum-network",
  "testnet": false
} as const satisfies Chain;