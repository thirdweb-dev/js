import type { Chain } from "../src/types";
export default {
  "chain": "RBN",
  "chainId": 153,
  "explorers": [
    {
      "name": "Redbelly Network Testnet Explorer",
      "url": "https://explorer.testnet.redbelly.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://redbelly.network",
  "name": "Redbelly Network Testnet",
  "nativeCurrency": {
    "name": "Redbelly Network Coin",
    "symbol": "RBNT",
    "decimals": 18
  },
  "networkId": 153,
  "rpc": [
    "https://153.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://governors.testnet.redbelly.network"
  ],
  "shortName": "rbn-testnet",
  "slip44": 1,
  "slug": "redbelly-network-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;