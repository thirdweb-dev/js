import type { Chain } from "../src/types";
export default {
  "name": "SX Network Testnet",
  "chain": "SX",
  "icon": "SX",
  "rpc": [
    "https://sx-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.toronto.sx.technology"
  ],
  "faucets": [
    "https://faucet.toronto.sx.technology"
  ],
  "nativeCurrency": {
    "name": "SX Network",
    "symbol": "SX",
    "decimals": 18
  },
  "infoURL": "https://www.sx.technology",
  "shortName": "SX-Testnet",
  "chainId": 647,
  "networkId": 647,
  "explorers": [
    {
      "name": "SX Network Toronto Explorer",
      "url": "https://explorer.toronto.sx.technology",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "sx-network-testnet"
} as const satisfies Chain;