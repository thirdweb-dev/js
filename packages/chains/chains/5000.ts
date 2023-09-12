import type { Chain } from "../src/types";
export default {
  "name": "Mantle",
  "chain": "ETH",
  "icon": {
    "url": "ipfs://QmYddHh5zdceSsBU7uGfQvEHg6UUtAFbzQBBaePS4whx7o",
    "width": 225,
    "height": 225,
    "format": "png"
  },
  "rpc": [
    "https://mantle.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mantle.xyz",
    "https://mantle.publicnode.com",
    "wss://mantle.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Mantle",
    "symbol": "MNT",
    "decimals": 18
  },
  "infoURL": "https://mantle.xyz",
  "shortName": "mantle",
  "chainId": 5000,
  "networkId": 5000,
  "explorers": [
    {
      "name": "Mantle Explorer",
      "url": "https://explorer.mantle.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.mantle.xyz"
      }
    ]
  },
  "testnet": false,
  "slug": "mantle"
} as const satisfies Chain;