import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 5000,
  "explorers": [
    {
      "name": "Mantle Explorer",
      "url": "https://explorer.mantle.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmYddHh5zdceSsBU7uGfQvEHg6UUtAFbzQBBaePS4whx7o",
    "width": 225,
    "height": 225,
    "format": "png"
  },
  "infoURL": "https://mantle.xyz",
  "name": "Mantle",
  "nativeCurrency": {
    "name": "Mantle",
    "symbol": "MNT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://mantle.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mantle.xyz",
    "https://mantle.publicnode.com",
    "wss://mantle.publicnode.com"
  ],
  "shortName": "mantle",
  "slug": "mantle",
  "testnet": false
} as const satisfies Chain;