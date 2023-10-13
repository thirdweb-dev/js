import type { Chain } from "../src/types";
export default {
  "chain": "myOwn",
  "chainId": 9999,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://docs.bccloud.net/",
  "name": "myOwn Testnet",
  "nativeCurrency": {
    "name": "MYN",
    "symbol": "MYN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://myown-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://geth.dev.bccloud.net"
  ],
  "shortName": "myn",
  "slug": "myown-testnet",
  "testnet": true
} as const satisfies Chain;