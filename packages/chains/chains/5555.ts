import type { Chain } from "../src/types";
export default {
  "chain": "CVERSE",
  "chainId": 5555,
  "explorers": [
    {
      "name": "Chain Verse Explorer",
      "url": "https://explorer.chainverse.info",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQyJt28h4wN3QHPXUQJQYQqGiFUD77han3zibZPzHbitk",
    "width": 1000,
    "height": 1436,
    "format": "png"
  },
  "infoURL": "https://chainverse.info",
  "name": "Chain Verse Mainnet",
  "nativeCurrency": {
    "name": "Oasys",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 5555,
  "rpc": [
    "https://chain-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5555.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.chainverse.info"
  ],
  "shortName": "cverse",
  "slug": "chain-verse",
  "testnet": false
} as const satisfies Chain;