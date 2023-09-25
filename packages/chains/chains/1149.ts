import type { Chain } from "../src/types";
export default {
  "chainId": 1149,
  "chain": "Plexchain",
  "name": "Symplexia Smart Chain",
  "rpc": [
    "https://symplexia-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://plex-rpc.plexfinance.us"
  ],
  "slug": "symplexia-smart-chain",
  "icon": {
    "url": "ipfs://QmcXzfMNSQ7SZzKemNquVoXyG5ergdqCGeLWjRYETGBTUM",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Plex Native Token",
    "symbol": "PLEX",
    "decimals": 18
  },
  "infoURL": "https://plexfinance.us/",
  "shortName": "Plexchain",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Plexchain Explorer",
      "url": "https://explorer.plexfinance.us",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;