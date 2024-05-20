import type { Chain } from "../src/types";
export default {
  "chain": "Grok",
  "chainId": 72992,
  "explorers": [
    {
      "name": "GrokScan",
      "url": "https://mainnet-explorer.grokchain.dev",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://grokchain.dev",
  "name": "Grok Chain Mainnet",
  "nativeCurrency": {
    "name": "Groc",
    "symbol": "GROC",
    "decimals": 18
  },
  "networkId": 72992,
  "rpc": [
    "https://72992.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.grokchain.dev"
  ],
  "shortName": "GrokChain",
  "slug": "grok-chain",
  "testnet": false
} as const satisfies Chain;