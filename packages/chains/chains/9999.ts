import type { Chain } from "../src/types";
export default {
  "chainId": 9999,
  "chain": "myOwn",
  "name": "myOwn Testnet",
  "rpc": [
    "https://myown-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://geth.dev.bccloud.net"
  ],
  "slug": "myown-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "MYN",
    "symbol": "MYN",
    "decimals": 18
  },
  "infoURL": "https://docs.bccloud.net/",
  "shortName": "myn",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;