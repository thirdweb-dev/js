import type { Chain } from "../src/types";
export default {
  "chain": "Hypr",
  "chainId": 882,
  "explorers": [
    {
      "name": "Explorer",
      "url": "https://explorer-testnet.hypr.network",
      "standard": "OP Stack EVM"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeie6wdqkhub4p346rixkvft3l2bxa3kzo4q6dh5c5vgq6oejwlhu4a/",
    "width": 3600,
    "height": 3600,
    "format": "ONG"
  },
  "name": "Hypr Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 882,
  "redFlags": [],
  "rpc": [
    "https://882.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.hypr.network"
  ],
  "shortName": "eth",
  "slug": "hypr-testnet",
  "testnet": true,
  "title": "https://explorer-testnet.hypr.network"
} as const satisfies Chain;