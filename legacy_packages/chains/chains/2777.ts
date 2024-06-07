import type { Chain } from "../src/types";
export default {
  "chain": "GM Network Mainnet",
  "chainId": 2777,
  "explorers": [
    {
      "name": "GM Network Mainnet Explorer",
      "url": "https://scan.gmnetwork.ai",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://gmnetwork.ai",
  "name": "GM Network Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2777,
  "rpc": [
    "https://2777.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gmnetwork.ai"
  ],
  "shortName": "gmnetwork-mainnet",
  "slug": "gm-network",
  "status": "active",
  "testnet": false
} as const satisfies Chain;