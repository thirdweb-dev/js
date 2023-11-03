import type { Chain } from "../types";
export default {
  "chain": "Plexchain",
  "chainId": 1149,
  "explorers": [
    {
      "name": "Plexchain Explorer",
      "url": "https://explorer.plexfinance.us",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmcXzfMNSQ7SZzKemNquVoXyG5ergdqCGeLWjRYETGBTUM",
        "width": 256,
        "height": 256,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmcXzfMNSQ7SZzKemNquVoXyG5ergdqCGeLWjRYETGBTUM",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://plexfinance.us/",
  "name": "Symplexia Smart Chain",
  "nativeCurrency": {
    "name": "Plex Native Token",
    "symbol": "PLEX",
    "decimals": 18
  },
  "networkId": 1149,
  "rpc": [
    "https://symplexia-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1149.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://plex-rpc.plexfinance.us"
  ],
  "shortName": "Plexchain",
  "slug": "symplexia-smart-chain",
  "testnet": false
} as const satisfies Chain;