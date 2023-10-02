import type { Chain } from "../src/types";
export default {
  "chain": "ALV",
  "chainId": 3797,
  "explorers": [
    {
      "name": "AlveyScan",
      "url": "https://alveyscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmSwczpPLBG6ob1a8WLoujthiCPzwEyJNp7WdKRi52qbWX",
    "width": 310,
    "height": 310,
    "format": "png"
  },
  "infoURL": "https://alveyscan.com/rpc",
  "name": "AlveyChain Mainnet",
  "nativeCurrency": {
    "name": "AlveyCoin",
    "symbol": "ALV",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://alveychain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.alveychain.com/rpc",
    "https://rpc2.alvey.io/rpc"
  ],
  "shortName": "alv",
  "slug": "alveychain",
  "testnet": false
} as const satisfies Chain;