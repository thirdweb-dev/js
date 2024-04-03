import type { Chain } from "../src/types";
export default {
  "chain": "tSEL",
  "chainId": 1953,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmbnLDuVc4JReFysyKvmpuqUtj9HCus6qoKD5nQ9QkokzK",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://selendra.org",
  "name": "Selendra Network Testnet",
  "nativeCurrency": {
    "name": "Selendra",
    "symbol": "tSEL",
    "decimals": 18
  },
  "networkId": 1953,
  "rpc": [
    "https://1953.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc0-testnet.selendra.org",
    "https://rpc1-testnet.selendra.org"
  ],
  "shortName": "tSEL",
  "slug": "selendra-network-testnet",
  "testnet": true
} as const satisfies Chain;