import type { Chain } from "../src/types";
export default {
  "chainId": 192837465,
  "chain": "GTH",
  "name": "Gather Mainnet Network",
  "rpc": [
    "https://gather-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.gather.network"
  ],
  "slug": "gather-network",
  "icon": {
    "url": "ipfs://Qmc9AJGg9aNhoH56n3deaZeUc8Ty1jDYJsW6Lu6hgSZH4S",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Gather",
    "symbol": "GTH",
    "decimals": 18
  },
  "infoURL": "https://gather.network",
  "shortName": "GTH",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.gather.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;