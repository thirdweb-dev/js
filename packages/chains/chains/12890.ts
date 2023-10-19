import type { Chain } from "../src/types";
export default {
  "chain": "tQNET",
  "chainId": 12890,
  "explorers": [
    {
      "name": "Quantum Scan Testnet",
      "url": "https://testnet.quantumscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreibwywok67uewqbtqdzgr7nlk3lvvg7hxmbgwtn7kdwxe34useucvm",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://quantumnetwork.gg",
  "name": "Quantum Chain Testnet",
  "nativeCurrency": {
    "name": "Quantum Chain",
    "symbol": "tQNET",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://quantum-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.quantumscan.org"
  ],
  "shortName": "tqnet",
  "slug": "quantum-chain-testnet",
  "testnet": true
} as const satisfies Chain;