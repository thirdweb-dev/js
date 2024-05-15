import type { Chain } from "../src/types";
export default {
  "chain": "NOW",
  "chainId": 2014,
  "explorers": [
    {
      "name": "nowscan",
      "url": "https://nowscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmSUzhRGzMyMyGwBcE3ooZ5jvHKyJ1FjVjh5SfoGHG36MX",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://nowchain.co",
  "name": "NOW Chain",
  "nativeCurrency": {
    "name": "NOW Coin",
    "symbol": "NOW",
    "decimals": 18
  },
  "networkId": 2014,
  "rpc": [
    "https://2014.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.nowscan.io"
  ],
  "shortName": "now",
  "slug": "now-chain",
  "testnet": false
} as const satisfies Chain;