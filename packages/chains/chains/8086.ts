import type { Chain } from "../src/types";
export default {
  "name": "BitEth",
  "chain": "BTE",
  "rpc": [
    "https://biteth.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.biteth.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BitEth",
    "symbol": "BTE",
    "decimals": 18
  },
  "infoURL": "https://biteth.org",
  "shortName": "BitEth",
  "chainId": 8086,
  "networkId": 8086,
  "explorers": [],
  "testnet": false,
  "slug": "biteth"
} as const satisfies Chain;