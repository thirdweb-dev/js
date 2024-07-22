import type { Chain } from "../src/types";
export default {
  "chain": "BlockEx",
  "chainId": 221,
  "explorers": [
    {
      "name": "BlockEx Scan",
      "url": "http://explorer.blockex.biz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://blockex.biz",
  "name": "BlockEx Mainnet",
  "nativeCurrency": {
    "name": "BlockEx",
    "symbol": "XBE",
    "decimals": 18
  },
  "networkId": 221,
  "rpc": [
    "https://221.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.blockex.biz"
  ],
  "shortName": "BlockEx",
  "slug": "blockex",
  "testnet": false
} as const satisfies Chain;