import type { Chain } from "../src/types";
export default {
  "chain": "GTH",
  "chainId": 356256156,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet-explorer.gather.network",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmTYR8CeFiNbJ1zJHnE3DK2wEN18r2y2vqSKUcLweUT2Gz",
        "width": 1080,
        "height": 1080,
        "format": "svg"
      }
    }
  ],
  "faucets": [
    "https://testnet-faucet.gather.network/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://Qmc9AJGg9aNhoH56n3deaZeUc8Ty1jDYJsW6Lu6hgSZH4S",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://gather.network",
  "name": "Gather Testnet Network",
  "nativeCurrency": {
    "name": "Gather",
    "symbol": "GTH",
    "decimals": 18
  },
  "networkId": 356256156,
  "redFlags": [],
  "rpc": [
    "https://gather-testnet-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://356256156.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.gather.network"
  ],
  "shortName": "tGTH",
  "slug": "gather-testnet-network",
  "testnet": true
} as const satisfies Chain;