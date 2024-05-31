import type { Chain } from "../src/types";
export default {
  "chain": "LYC",
  "chainId": 721,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.lycanchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZsp3gnmHCJPw3qReiqV8P8Ct5Eidib4E5jDNfBUxYEgP",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://lycanchain.com",
  "name": "Lycan Chain",
  "nativeCurrency": {
    "name": "Lycan",
    "symbol": "LYC",
    "decimals": 18
  },
  "networkId": 721,
  "rpc": [
    "https://721.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lycanchain.com/",
    "https://us-east.lycanchain.com",
    "https://us-west.lycanchain.com",
    "https://eu-north.lycanchain.com",
    "https://eu-west.lycanchain.com",
    "https://asia-southeast.lycanchain.com"
  ],
  "shortName": "LYC",
  "slug": "lycan-chain",
  "testnet": false
} as const satisfies Chain;