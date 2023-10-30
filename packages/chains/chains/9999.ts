import type { Chain } from "../src/types";
export default {
  "chain": "myOwn",
  "chainId": 9999,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://docs.bccloud.net/",
  "name": "myOwn Testnet",
  "nativeCurrency": {
    "name": "MYN",
    "symbol": "MYN",
    "decimals": 18
  },
  "networkId": 9999,
  "rpc": [
    "https://myown-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9999.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://geth.dev.bccloud.net"
  ],
  "shortName": "myn",
  "slug": "myown-testnet",
  "testnet": true
} as const satisfies Chain;