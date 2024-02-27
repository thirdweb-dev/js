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
  "networkId": 12890,
  "rpc": [
    "https://12890.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.quantumscan.org"
  ],
  "shortName": "tqnet",
  "slip44": 1,
  "slug": "quantum-chain-testnet",
  "testnet": true
} as const satisfies Chain;