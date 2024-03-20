import type { Chain } from "../src/types";
export default {
  "chain": "$HYB",
  "chainId": 1224,
  "explorers": [
    {
      "name": "Hybrid Testnet",
      "url": "https://alphatestnet.buildonhybrid.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmdGfvH9qfvbMXYKosS1nHbw3q5UtFJky4hdMDmmKDTx8Y",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "infoURL": "https://buildonhybrid.com",
  "name": "Hybrid Testnet",
  "nativeCurrency": {
    "name": "Hybrid",
    "symbol": "$HYB",
    "decimals": 18
  },
  "networkId": 1224,
  "rpc": [
    "https://1224.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.buildonhybrid.com"
  ],
  "shortName": "hyb",
  "slug": "hybrid-testnet",
  "testnet": true
} as const satisfies Chain;