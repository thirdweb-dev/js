import type { Chain } from "../src/types";
export default {
  "chain": "tGUN",
  "chainId": 49321,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.gunzscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://Qmd5R5khFePwY9dYBGhjRA1rGtUAKaHg7Z2B7mBrbA6TiB",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://gunbygunz.com",
  "name": "GUNZ Testnet",
  "nativeCurrency": {
    "name": "GUN",
    "symbol": "GUN",
    "decimals": 18
  },
  "networkId": 49321,
  "rpc": [
    "https://49321.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gunz.dev/ext/bc/ryk9vkvNuKtewME2PeCgybo9sdWXGmCkBrrx4VPuZPdVdAak8/rpc"
  ],
  "shortName": "Stork",
  "slug": "gunz-testnet",
  "testnet": true
} as const satisfies Chain;