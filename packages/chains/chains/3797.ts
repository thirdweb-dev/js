import type { Chain } from "../src/types";
export default {
  "name": "AlveyChain Mainnet",
  "chain": "ALV",
  "icon": {
    "url": "ipfs://QmSwczpPLBG6ob1a8WLoujthiCPzwEyJNp7WdKRi52qbWX",
    "width": 310,
    "height": 310,
    "format": "png"
  },
  "rpc": [
    "https://alveychain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.alveychain.com/rpc",
    "https://rpc2.alvey.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "AlveyCoin",
    "symbol": "ALV",
    "decimals": 18
  },
  "infoURL": "https://alveyscan.com/rpc",
  "shortName": "alv",
  "chainId": 3797,
  "networkId": 3797,
  "explorers": [
    {
      "name": "AlveyScan",
      "url": "https://alveyscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "alveychain"
} as const satisfies Chain;