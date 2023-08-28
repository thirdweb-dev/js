import type { Chain } from "../src/types";
export default {
  "name": "Bitchain Mainnet",
  "chain": "Bit",
  "rpc": [
    "https://bitchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitchain.biz/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://www.bitchain.biz/",
  "shortName": "bit",
  "chainId": 198,
  "networkId": 198,
  "explorers": [
    {
      "name": "Bitchain Scan",
      "url": "https://explorer.bitchain.biz",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bitchain"
} as const satisfies Chain;