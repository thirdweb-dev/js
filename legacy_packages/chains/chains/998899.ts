import type { Chain } from "../src/types";
export default {
  "chain": "Supernet Testnet",
  "chainId": 998899,
  "explorers": [
    {
      "name": "supernet-testnet-explorer",
      "url": "https://testnet-explorer.supernet.chaingames.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.chaingames.io"
  ],
  "name": "Supernet Testnet",
  "nativeCurrency": {
    "name": "CHAIN",
    "symbol": "CHAIN",
    "decimals": 18
  },
  "networkId": 998899,
  "rpc": [
    "https://998899.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.supernet.chaingames.io/"
  ],
  "shortName": "supernetchain",
  "slip44": 1,
  "slug": "supernet-testnet",
  "testnet": true,
  "title": "Supernet Testnet"
} as const satisfies Chain;