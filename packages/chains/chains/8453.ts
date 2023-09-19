import type { Chain } from "../src/types";
export default {
  "name": "Base",
  "chain": "ETH",
  "rpc": [
    "https://base.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.base.org/",
    "https://developer-access-mainnet.base.org/",
    "https://base.gateway.tenderly.co",
    "wss://base.gateway.tenderly.co",
    "https://base.publicnode.com",
    "wss://base.publicnode.com"
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
  "icon": {
    "url": "ipfs://QmW5Vn15HeRkScMfPcW12ZdZcC2yUASpu6eCsECRdEmjjj/base-512.png",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "basescout",
      "url": "https://base.blockscout.com",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    },
    {
      "name": "basescan",
      "url": "https://basescan.org",
      "standard": "none"
    }
  ],
  "status": "active",
  "testnet": false,
  "slug": "base"
} as const satisfies Chain;