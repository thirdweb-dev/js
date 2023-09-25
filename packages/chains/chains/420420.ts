import type { Chain } from "../src/types";
export default {
  "chainId": 420420,
  "chain": "kek",
  "name": "Kekchain",
  "rpc": [
    "https://kekchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.kekchain.com"
  ],
  "slug": "kekchain",
  "icon": {
    "url": "ipfs://QmNzwHAmaaQyuvKudrzGkrTT2GMshcmCmJ9FH8gG2mNJtM",
    "width": 401,
    "height": 401,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "KEK",
    "symbol": "KEK",
    "decimals": 18
  },
  "infoURL": "https://kekchain.com",
  "shortName": "KEK",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://mainnet-explorer.kekchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;