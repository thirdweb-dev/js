import type { Chain } from "../src/types";
export default {
  "chain": "SatoshiVM",
  "chainId": 3110,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmdXnQw9YwzEBZnciSe42MMwnH1SqhfY3FcVbseyM4k7Th",
    "width": 940,
    "height": 941,
    "format": "png"
  },
  "infoURL": "https://www.satoshivm.io/",
  "name": "SatoshiVM Testnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 3110,
  "rpc": [
    "https://3110.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-rpc-node-http.svmscan.io"
  ],
  "shortName": "tSAVM",
  "slug": "satoshivm-testnet",
  "testnet": true
} as const satisfies Chain;