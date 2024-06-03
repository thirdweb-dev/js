import type { Chain } from "../src/types";
export default {
  "chain": "Aura",
  "chainId": 6322,
  "explorers": [
    {
      "name": "Aurascan Explorer",
      "url": "https://aurascan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmbpQPpjKy1bkDmuzCSSE9iFTUK37AiWYgJbgN3Fr7MWYq",
        "width": 512,
        "height": 557,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmbpQPpjKy1bkDmuzCSSE9iFTUK37AiWYgJbgN3Fr7MWYq",
    "width": 512,
    "height": 557,
    "format": "png"
  },
  "infoURL": "https://aura.network",
  "name": "Aura Mainnet",
  "nativeCurrency": {
    "name": "Aura",
    "symbol": "AURA",
    "decimals": 18
  },
  "networkId": 6322,
  "rpc": [
    "https://6322.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.aura.network"
  ],
  "shortName": "aura",
  "slip44": 1,
  "slug": "aura",
  "testnet": false
} as const satisfies Chain;