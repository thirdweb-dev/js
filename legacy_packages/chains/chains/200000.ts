import type { Chain } from "../src/types";
export default {
  "chain": "FAIT",
  "chainId": 200000,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://xfair.ai",
  "name": "xFair.AI Testnet",
  "nativeCurrency": {
    "name": "FAI",
    "symbol": "FAI",
    "decimals": 18
  },
  "networkId": 200000,
  "rpc": [
    "https://200000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc_testnet.xfair.ai",
    "wss://rpc_testnet.xfair.ai"
  ],
  "shortName": "fait",
  "slug": "xfair-ai-testnet",
  "testnet": true
} as const satisfies Chain;