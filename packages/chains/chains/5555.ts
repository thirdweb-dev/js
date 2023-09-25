import type { Chain } from "../src/types";
export default {
  "chainId": 5555,
  "chain": "CVERSE",
  "name": "Chain Verse Mainnet",
  "rpc": [
    "https://chain-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.chainverse.info"
  ],
  "slug": "chain-verse",
  "icon": {
    "url": "ipfs://QmQyJt28h4wN3QHPXUQJQYQqGiFUD77han3zibZPzHbitk",
    "width": 1000,
    "height": 1436,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Oasys",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://chainverse.info",
  "shortName": "cverse",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Chain Verse Explorer",
      "url": "https://explorer.chainverse.info",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;