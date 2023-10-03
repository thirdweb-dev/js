import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 10086,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://sjis.me",
  "name": "SJATSH",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://sjatsh.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://geth.free.idcfengye.com"
  ],
  "shortName": "SJ",
  "slug": "sjatsh",
  "testnet": false
} as const satisfies Chain;