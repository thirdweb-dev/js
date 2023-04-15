import type { Chain } from "../src/types";
export default {
  "name": "Gather Mainnet Network",
  "chain": "GTH",
  "rpc": [
    "https://gather-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.gather.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gather",
    "symbol": "GTH",
    "decimals": 18
  },
  "infoURL": "https://gather.network",
  "shortName": "GTH",
  "chainId": 192837465,
  "networkId": 192837465,
  "icon": {
    "url": "ipfs://Qmc9AJGg9aNhoH56n3deaZeUc8Ty1jDYJsW6Lu6hgSZH4S",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.gather.network",
      "icon": {
        "url": "ipfs://QmeoEHUVYKSJFkM9o5j62rhQqCDN5iQxPC7PtzmH77rSWR",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "gather-network"
} as const satisfies Chain;