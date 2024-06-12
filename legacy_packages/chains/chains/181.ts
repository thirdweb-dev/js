import type { Chain } from "../src/types";
export default {
  "chain": "Waterfall Network",
  "chainId": 181,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmSDJPBKh9cLVL8UZ5KYwdwPyhD8bRWNb33jjt48wtu5Uc",
    "width": 241,
    "height": 179,
    "format": "png"
  },
  "infoURL": "https://waterfall.network",
  "name": "Waterfall Network",
  "nativeCurrency": {
    "name": "WATER",
    "symbol": "WATER",
    "decimals": 18
  },
  "networkId": 181,
  "rpc": [
    "https://181.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.waterfall.network/"
  ],
  "shortName": "water",
  "slug": "waterfall-network",
  "testnet": false
} as const satisfies Chain;