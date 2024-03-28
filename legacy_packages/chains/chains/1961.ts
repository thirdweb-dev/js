import type { Chain } from "../src/types";
export default {
  "chain": "SEL",
  "chainId": 1961,
  "explorers": [
    {
      "name": "Selendra Scan",
      "url": "https://scan.selendra.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmbnLDuVc4JReFysyKvmpuqUtj9HCus6qoKD5nQ9QkokzK",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://selendra.org",
  "name": "Selendra Network Mainnet",
  "nativeCurrency": {
    "name": "Selendra",
    "symbol": "SEL",
    "decimals": 18
  },
  "networkId": 1961,
  "rpc": [
    "https://1961.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc0.selendra.org",
    "https://rpc1.selendra.org"
  ],
  "shortName": "SEL",
  "slug": "selendra-network",
  "testnet": false
} as const satisfies Chain;