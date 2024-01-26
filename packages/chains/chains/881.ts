import type { Chain } from "../src/types";
export default {
  "chain": "Hypr",
  "chainId": 881,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeie6wdqkhub4p346rixkvft3l2bxa3kzo4q6dh5c5vgq6oejwlhu4a/",
    "width": 3600,
    "height": 3600,
    "format": "PNG"
  },
  "infoURL": "https://www.hypr.network",
  "name": "Hypr Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 881,
  "parent": {
    "type": "OP Stack",
    "chain": "OP",
    "bridges": []
  },
  "redFlags": [],
  "rpc": [
    "https://hypr.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://881.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.hypr.network"
  ],
  "shortName": "ether",
  "slug": "hypr",
  "testnet": false
} as const satisfies Chain;