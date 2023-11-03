import type { Chain } from "../types";
export default {
  "chain": "GTH",
  "chainId": 192837465,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.gather.network",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmTYR8CeFiNbJ1zJHnE3DK2wEN18r2y2vqSKUcLweUT2Gz",
        "width": 1080,
        "height": 1080,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://Qmc9AJGg9aNhoH56n3deaZeUc8Ty1jDYJsW6Lu6hgSZH4S",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://gather.network",
  "name": "Gather Mainnet Network",
  "nativeCurrency": {
    "name": "Gather",
    "symbol": "GTH",
    "decimals": 18
  },
  "networkId": 192837465,
  "redFlags": [],
  "rpc": [
    "https://gather-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://192837465.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.gather.network"
  ],
  "shortName": "GTH",
  "slug": "gather-network",
  "testnet": false
} as const satisfies Chain;