import type { Chain } from "../src/types";
export default {
  "chainId": 420666,
  "chain": "kek",
  "name": "Kekchain (kektest)",
  "rpc": [
    "https://kekchain-kektest.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.kekchain.com"
  ],
  "slug": "kekchain-kektest",
  "icon": {
    "url": "ipfs://QmNzwHAmaaQyuvKudrzGkrTT2GMshcmCmJ9FH8gG2mNJtM",
    "width": 401,
    "height": 401,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "tKEK",
    "symbol": "tKEK",
    "decimals": 18
  },
  "infoURL": "https://kekchain.com",
  "shortName": "tKEK",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer.kekchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;