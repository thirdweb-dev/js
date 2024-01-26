import type { Chain } from "../src/types";
export default {
  "chain": "Bit",
  "chainId": 198,
  "explorers": [
    {
      "name": "Bitchain Scan",
      "url": "https://explorer.bitchain.biz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.bitchain.biz/",
  "name": "Bitchain Mainnet",
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 198,
  "rpc": [
    "https://bitchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://198.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitchain.biz/"
  ],
  "shortName": "bit",
  "slug": "bitchain",
  "testnet": false
} as const satisfies Chain;