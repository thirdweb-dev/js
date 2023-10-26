import type { Chain } from "../src/types";
export default {
  "chain": "QNET",
  "chainId": 81720,
  "explorers": [
    {
      "name": "Quantum Scan Mainnet",
      "url": "https://quantumscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreibwywok67uewqbtqdzgr7nlk3lvvg7hxmbgwtn7kdwxe34useucvm",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://quantumnetwork.gg",
  "name": "Quantum Chain Mainnet",
  "nativeCurrency": {
    "name": "Quantum Chain",
    "symbol": "QNET",
    "decimals": 18
  },
  "networkId": 81720,
  "rpc": [
    "https://quantum-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://81720.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.quantumscan.org"
  ],
  "shortName": "qnet",
  "slug": "quantum-chain",
  "testnet": false
} as const satisfies Chain;