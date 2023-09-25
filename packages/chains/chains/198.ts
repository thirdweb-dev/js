import type { Chain } from "../src/types";
export default {
  "chainId": 198,
  "chain": "Bit",
  "name": "Bitchain Mainnet",
  "rpc": [
    "https://bitchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitchain.biz/"
  ],
  "slug": "bitchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://www.bitchain.biz/",
  "shortName": "bit",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bitchain Scan",
      "url": "https://explorer.bitchain.biz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;