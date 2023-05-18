import type { Chain } from "../src/types";
export default {
  "name": "SOMA Network Testnet",
  "chain": "SOMA",
  "rpc": [
    "https://soma-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-testnet-v1.somanetwork.io/"
  ],
  "faucets": [
    "https://faucet.somanetwork.io"
  ],
  "nativeCurrency": {
    "name": "SMA",
    "symbol": "tSMA",
    "decimals": 18
  },
  "infoURL": "https://somanetwork.io",
  "shortName": "sma",
  "chainId": 2323,
  "networkId": 2323,
  "icon": {
    "url": "ipfs://QmadSU2tcyvuzssDYGJ4rVLag43QLnKwcBerZR2zKLVU2N",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "explorers": [
    {
      "name": "SOMA Testnet Explorer",
      "icon": {
        "url": "ipfs://QmadSU2tcyvuzssDYGJ4rVLag43QLnKwcBerZR2zKLVU2N",
        "width": 500,
        "height": 500,
        "format": "png"
      },
      "url": "https://testnet.somascan.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "soma-network-testnet"
} as const satisfies Chain;