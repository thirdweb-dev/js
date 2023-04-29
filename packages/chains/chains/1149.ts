import type { Chain } from "../src/types";
export default {
  "name": "Symplexia Smart Chain",
  "chain": "Plexchain",
  "rpc": [
    "https://symplexia-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://plex-rpc.plexfinance.us"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Plex Native Token",
    "symbol": "PLEX",
    "decimals": 18
  },
  "infoURL": "https://plexfinance.us/",
  "shortName": "Plexchain",
  "chainId": 1149,
  "networkId": 1149,
  "icon": {
    "url": "ipfs://QmcXzfMNSQ7SZzKemNquVoXyG5ergdqCGeLWjRYETGBTUM",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Plexchain Explorer",
      "url": "https://explorer.plexfinance.us",
      "icon": {
        "url": "ipfs://QmcXzfMNSQ7SZzKemNquVoXyG5ergdqCGeLWjRYETGBTUM",
        "width": 256,
        "height": 256,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "symplexia-smart-chain"
} as const satisfies Chain;