import type { Chain } from "../src/types";
export default {
  "chain": "INOAI",
  "chainId": 88559,
  "explorers": [
    {
      "name": "inoai live",
      "url": "https://inoai.live",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmdP8zAZEwUbf3pt8t9Ykho866ni5AMgutvkn3cBsV8gKG",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://inoai.info",
  "name": "Inoai Network",
  "nativeCurrency": {
    "name": "Inoai",
    "symbol": "INO",
    "decimals": 18
  },
  "networkId": 88559,
  "rpc": [
    "https://88559.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://inoai-network.com"
  ],
  "shortName": "INOAI",
  "slug": "inoai-network",
  "testnet": false
} as const satisfies Chain;