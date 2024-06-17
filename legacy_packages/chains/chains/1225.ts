import type { Chain } from "../src/types";
export default {
  "chain": "HYB",
  "chainId": 1225,
  "explorers": [
    {
      "name": "Hybrid Testnet",
      "url": "https://explorer.buildonhybrid.com",
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
    "symbol": "HYB",
    "decimals": 18
  },
  "networkId": 1225,
  "rpc": [
    "https://1225.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://hybrid-testnet.rpc.caldera.xyz/http",
    "wss://hybrid-testnet.rpc.caldera.xyz/ws"
  ],
  "shortName": "hyb",
  "slug": "hybrid-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;