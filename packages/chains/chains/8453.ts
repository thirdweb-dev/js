import type { Chain } from "../src/types";
export default {
  "name": "Base",
  "chain": "ETH",
  "rpc": [
    "https://base.rpc.thirdweb.com/${THIRDWEB_API_KEY}"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://base.org",
  "shortName": "base",
  "chainId": 8453,
  "networkId": 8453,
  "status": "active",
  "icon": {
    "url": "ipfs://QmW5Vn15HeRkScMfPcW12ZdZcC2yUASpu6eCsECRdEmjjj/base-512.png",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "testnet": false,
  "slug": "base"
} as const satisfies Chain;