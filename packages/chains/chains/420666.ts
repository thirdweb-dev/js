import type { Chain } from "../src/types";
export default {
  "chain": "kek",
  "chainId": 420666,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer.kekchain.com",
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
  "name": "Kekchain (kektest)",
  "nativeCurrency": {
    "name": "tKEK",
    "symbol": "tKEK",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://kekchain-kektest.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.kekchain.com"
  ],
  "shortName": "tKEK",
  "slug": "kekchain-kektest",
  "testnet": true
} as const satisfies Chain;