import type { Chain } from "../src/types";
export default {
  "chainId": 3797,
  "chain": "ALV",
  "name": "AlveyChain Mainnet",
  "rpc": [
    "https://alveychain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.alveychain.com/rpc",
    "https://rpc2.alvey.io/rpc"
  ],
  "slug": "alveychain",
  "icon": {
    "url": "ipfs://QmSwczpPLBG6ob1a8WLoujthiCPzwEyJNp7WdKRi52qbWX",
    "width": 310,
    "height": 310,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "AlveyCoin",
    "symbol": "ALV",
    "decimals": 18
  },
  "infoURL": "https://alveyscan.com/rpc",
  "shortName": "alv",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "AlveyScan",
      "url": "https://alveyscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;