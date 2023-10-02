import type { Chain } from "../src/types";
export default {
  "name": "Quantum Chain Mainnet",
  "chain": "QNET",
  "icon": {
    "url": "ipfs://bafkreibwywok67uewqbtqdzgr7nlk3lvvg7hxmbgwtn7kdwxe34useucvm",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "rpc": [
    "https://quantum-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.quantumscan.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Quantum Chain",
    "symbol": "QNET",
    "decimals": 18
  },
  "infoURL": "https://quantumnetwork.gg",
  "shortName": "qnet",
  "chainId": 81720,
  "networkId": 81720,
  "explorers": [
    {
      "name": "Quantum Scan Mainnet",
      "url": "https://quantumscan.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "quantum-chain"
} as const satisfies Chain;