import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 8453,
  "ens": {
    "registry": "0xeCBaE6E54bAA669005b93342E5650d5886D54fc7"
  },
  "explorers": [
    {
      "name": "basescan",
      "url": "https://basescan.org",
      "standard": "none"
    },
    {
      "name": "basescout",
      "url": "https://base.blockscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    },
    {
      "name": "dexguru",
      "url": "https://base.dex.guru",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRaASKRSjQ5btoUQ2rNTJNxKtx2a2RoewgA7DMQkLVEne",
        "width": 83,
        "height": 82,
        "format": "svg"
      }
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
  "networkId": 8453,
  "redFlags": [],
  "rpc": [
    "https://base.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8453.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
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