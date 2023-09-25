import type { Chain } from "../src/types";
export default {
  "chainId": 2300,
  "chain": "BOMB",
  "name": "BOMB Chain",
  "rpc": [
    "https://bomb-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bombchain.com"
  ],
  "slug": "bomb-chain",
  "icon": {
    "url": "ipfs://Qmc44uSjfdNHdcxPTgZAL8eZ8TLe4UmSHibcvKQFyGJxTB",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "BOMB Token",
    "symbol": "BOMB",
    "decimals": 18
  },
  "infoURL": "https://www.bombchain.com",
  "shortName": "bomb",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "bombscan",
      "url": "https://bombscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;