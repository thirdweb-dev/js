import type { Chain } from "../src/types";
export default {
  "chainId": 10086,
  "chain": "ETH",
  "name": "SJATSH",
  "rpc": [
    "https://sjatsh.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://geth.free.idcfengye.com"
  ],
  "slug": "sjatsh",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://sjis.me",
  "shortName": "SJ",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;