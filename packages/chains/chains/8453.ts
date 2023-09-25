import type { Chain } from "../src/types";
export default {
  "chainId": 8453,
  "chain": "ETH",
  "name": "Base",
  "rpc": [
    "https://base.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.base.org/",
    "https://developer-access-mainnet.base.org/",
    "https://base.gateway.tenderly.co",
    "wss://base.gateway.tenderly.co",
    "https://base.publicnode.com",
    "wss://base.publicnode.com"
  ],
  "slug": "base",
  "icon": {
    "url": "ipfs://QmW5Vn15HeRkScMfPcW12ZdZcC2yUASpu6eCsECRdEmjjj/base-512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://base.org",
  "shortName": "base",
  "testnet": false,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "basescan",
      "url": "https://basescan.org",
      "standard": "none"
    },
    {
      "name": "basescout",
      "url": "https://base.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;