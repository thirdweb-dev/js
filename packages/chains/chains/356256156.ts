import type { Chain } from "../src/types";
export default {
  "chainId": 356256156,
  "chain": "GTH",
  "name": "Gather Testnet Network",
  "rpc": [
    "https://gather-testnet-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.gather.network"
  ],
  "slug": "gather-testnet-network",
  "icon": {
    "url": "ipfs://Qmc9AJGg9aNhoH56n3deaZeUc8Ty1jDYJsW6Lu6hgSZH4S",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://testnet-faucet.gather.network/"
  ],
  "nativeCurrency": {
    "name": "Gather",
    "symbol": "GTH",
    "decimals": 18
  },
  "infoURL": "https://gather.network",
  "shortName": "tGTH",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet-explorer.gather.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;