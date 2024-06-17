import type { Chain } from "../src/types";
export default {
  "chain": "Ham",
  "chainId": 5112,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.ham.fun",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmcbYVenTET9HBS7vs7SGv1MNqnRscAKVF5kaRVHaVCfvs",
    "width": 500,
    "height": 500,
    "format": "jpg"
  },
  "infoURL": "https://ham.fun",
  "name": "Ham",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 5112,
  "rpc": [
    "https://5112.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ham.fun"
  ],
  "shortName": "ham",
  "slug": "ham",
  "status": "active",
  "testnet": false
} as const satisfies Chain;