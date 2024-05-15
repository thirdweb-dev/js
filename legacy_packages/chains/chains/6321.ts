import type { Chain } from "../src/types";
export default {
  "chain": "Aura",
  "chainId": 6321,
  "explorers": [
    {
      "name": "Aurascan Explorer",
      "url": "https://euphoria.aurascan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmbpQPpjKy1bkDmuzCSSE9iFTUK37AiWYgJbgN3Fr7MWYq",
        "width": 512,
        "height": 557,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://aura.faucetme.pro"
  ],
  "icon": {
    "url": "ipfs://QmbpQPpjKy1bkDmuzCSSE9iFTUK37AiWYgJbgN3Fr7MWYq",
    "width": 512,
    "height": 557,
    "format": "png"
  },
  "infoURL": "https://aura.network",
  "name": "Aura Euphoria Testnet",
  "nativeCurrency": {
    "name": "test-EAura",
    "symbol": "eAura",
    "decimals": 18
  },
  "networkId": 6321,
  "rpc": [
    "https://6321.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.euphoria.aura.network"
  ],
  "shortName": "eaura",
  "slip44": 1,
  "slug": "aura-euphoria-testnet",
  "testnet": true
} as const satisfies Chain;