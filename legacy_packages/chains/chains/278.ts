import type { Chain } from "../src/types";
export default {
  "chain": "FAI",
  "chainId": 278,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://xfair.ai",
  "name": "xFair.AI Mainnet",
  "nativeCurrency": {
    "name": "FAI",
    "symbol": "FAI",
    "decimals": 18
  },
  "networkId": 278,
  "rpc": [
    "https://278.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc_mainnet.xfair.ai",
    "wss://rpc_mainnet.xfair.ai"
  ],
  "shortName": "fai",
  "slug": "xfair-ai",
  "testnet": false
} as const satisfies Chain;