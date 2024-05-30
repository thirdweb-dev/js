import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 27483,
  "explorers": [
    {
      "name": "Nanon Sepolia Rollup Testnet Explorer",
      "url": "https://sepolia-explorer.nanon.network",
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
  "name": "Nanon Sepolia",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 27483,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://sepolia-bridge.nanon.network"
      }
    ]
  },
  "rpc": [
    "https://27483.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-rpc.nanon.network"
  ],
  "shortName": "Nanon-Testnet",
  "slip44": 1,
  "slug": "nanon-sepolia",
  "testnet": true,
  "title": "Nanon Sepolia Rollup Testnet"
} as const satisfies Chain;