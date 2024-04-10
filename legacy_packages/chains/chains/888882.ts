import type { Chain } from "../src/types";
export default {
  "chain": "REXX",
  "chainId": 888882,
  "explorers": [
    {
      "name": "REXX Mainnet Explorer",
      "url": "https://rexxnetwork.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://rexxnetwork.com",
  "name": "REXX Mainnet",
  "nativeCurrency": {
    "name": "REXX",
    "symbol": "REXX",
    "decimals": 18
  },
  "networkId": 888882,
  "rpc": [
    "https://888882.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rexxnetwork.com"
  ],
  "shortName": "REXX",
  "slug": "rexx",
  "testnet": false,
  "title": "REXX Mainnet"
} as const satisfies Chain;