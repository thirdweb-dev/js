import type { Chain } from "../src/types";
export default {
  "chain": "SatoshiVM",
  "chainId": 3109,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmdXnQw9YwzEBZnciSe42MMwnH1SqhfY3FcVbseyM4k7Th",
    "width": 940,
    "height": 941,
    "format": "png"
  },
  "infoURL": "https://www.satoshivm.io/",
  "name": "SatoshiVM Alpha Mainnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 3109,
  "rpc": [
    "https://3109.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://alpha-rpc-node-http.svmscan.io"
  ],
  "shortName": "SAVM",
  "slug": "satoshivm-alpha",
  "testnet": false
} as const satisfies Chain;