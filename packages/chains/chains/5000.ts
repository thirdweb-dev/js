import type { Chain } from "../src/types";
export default {
  "chainId": 5000,
  "chain": "ETH",
  "name": "Mantle",
  "rpc": [
    "https://mantle.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mantle.xyz",
    "https://mantle.publicnode.com",
    "wss://mantle.publicnode.com"
  ],
  "slug": "mantle",
  "icon": {
    "url": "ipfs://QmYddHh5zdceSsBU7uGfQvEHg6UUtAFbzQBBaePS4whx7o",
    "width": 225,
    "height": 225,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Mantle",
    "symbol": "MNT",
    "decimals": 18
  },
  "infoURL": "https://mantle.xyz",
  "shortName": "mantle",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Mantle Explorer",
      "url": "https://explorer.mantle.xyz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;