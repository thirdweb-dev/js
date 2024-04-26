import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 2748,
  "explorers": [
    {
      "name": "Nanon Rollup Explorer",
      "url": "https://explorer.nanon.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeiduib2fygrwziqpy4yuqr6vvnd6elhahpigbcowcipjjhk6c3qiny",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://www.nanon.network",
  "name": "Nanon",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2748,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.nanon.network"
      }
    ]
  },
  "rpc": [
    "https://2748.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.nanon.network"
  ],
  "shortName": "Nanon",
  "slip44": 1,
  "slug": "nanon",
  "testnet": false,
  "title": "Nanon Rollup"
} as const satisfies Chain;