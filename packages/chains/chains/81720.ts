import type { Chain } from "../src/types";
export default {
  "chainId": 81720,
  "chain": "QNET",
  "name": "Quantum Chain Mainnet",
  "rpc": [
    "https://quantum-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.quantumscan.org"
  ],
  "slug": "quantum-chain",
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
  "shortName": "qnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Quantum Scan Mainnet",
      "url": "https://quantumscan.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;