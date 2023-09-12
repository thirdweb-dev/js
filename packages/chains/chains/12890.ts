import type { Chain } from "../src/types";
export default {
  "name": "Quantum Chain Testnet",
  "chain": "QNET",
  "icon": {
    "url": "ipfs://bafkreibwywok67uewqbtqdzgr7nlk3lvvg7hxmbgwtn7kdwxe34useucvm",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "rpc": [
    "https://quantum-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.quantumscan.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Quantum Chain",
    "symbol": "QNET",
    "decimals": 18
  },
  "infoURL": "https://quantumnetwork.gg",
  "shortName": "qnet",
  "chainId": 12890,
  "networkId": 12890,
  "explorers": [
    {
      "name": "Quantum Scan Testnet",
      "url": "https://testnet.quantumscan.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "quantum-chain-testnet"
} as const satisfies Chain;