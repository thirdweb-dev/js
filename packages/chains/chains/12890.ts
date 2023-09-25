import type { Chain } from "../src/types";
export default {
  "chainId": 12890,
  "chain": "tQNET",
  "name": "Quantum Chain Testnet",
  "rpc": [
    "https://quantum-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.quantumscan.org"
  ],
  "slug": "quantum-chain-testnet",
  "icon": {
    "url": "ipfs://bafkreibwywok67uewqbtqdzgr7nlk3lvvg7hxmbgwtn7kdwxe34useucvm",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Quantum Chain",
    "symbol": "tQNET",
    "decimals": 18
  },
  "infoURL": "https://quantumnetwork.gg",
  "shortName": "tqnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Quantum Scan Testnet",
      "url": "https://testnet.quantumscan.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;