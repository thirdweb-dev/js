import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 8453,
  "explorers": [
    {
      "name": "basescout",
      "url": "https://base.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "basescan",
      "url": "https://basescan.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmW5Vn15HeRkScMfPcW12ZdZcC2yUASpu6eCsECRdEmjjj/base-512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://base.org",
  "name": "Base",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://base.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.base.org/",
    "https://developer-access-mainnet.base.org/",
    "https://base.gateway.tenderly.co",
    "wss://base.gateway.tenderly.co",
    "https://base.publicnode.com",
    "wss://base.publicnode.com"
  ],
  "shortName": "base",
  "slug": "base",
  "status": "active",
  "testnet": false
} as const satisfies Chain;