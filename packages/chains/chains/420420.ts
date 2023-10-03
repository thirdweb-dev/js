import type { Chain } from "../src/types";
export default {
  "chain": "kek",
  "chainId": 420420,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://mainnet-explorer.kekchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmNzwHAmaaQyuvKudrzGkrTT2GMshcmCmJ9FH8gG2mNJtM",
    "width": 401,
    "height": 401,
    "format": "svg"
  },
  "infoURL": "https://kekchain.com",
  "name": "Kekchain",
  "nativeCurrency": {
    "name": "KEK",
    "symbol": "KEK",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://kekchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.kekchain.com"
  ],
  "shortName": "KEK",
  "slug": "kekchain",
  "testnet": false
} as const satisfies Chain;