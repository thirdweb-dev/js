import type { Chain } from "../src/types";
export default {
  "name": "Gather Testnet Network",
  "chain": "GTH",
  "rpc": [
    "https://gather-testnet-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.gather.network"
  ],
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
  "chainId": 356256156,
  "networkId": 356256156,
  "icon": {
    "url": "ipfs://Qmc9AJGg9aNhoH56n3deaZeUc8Ty1jDYJsW6Lu6hgSZH4S",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet-explorer.gather.network",
      "icon": {
        "url": "ipfs://QmeoEHUVYKSJFkM9o5j62rhQqCDN5iQxPC7PtzmH77rSWR",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "gather-testnet-network"
} as const satisfies Chain;