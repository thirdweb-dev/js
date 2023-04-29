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
        "url": "ipfs://QmTYR8CeFiNbJ1zJHnE3DK2wEN18r2y2vqSKUcLweUT2Gz",
        "width": 1080,
        "height": 1080,
        "format": "svg"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "gather-network"
} as const satisfies Chain;