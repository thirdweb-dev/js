import type { Chain } from "../src/types";
export default {
  "chainId": 2323,
  "chain": "SOMA",
  "name": "SOMA Network Testnet",
  "rpc": [
    "https://soma-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-testnet-v1.somanetwork.io/",
    "https://testnet-au-server-2.somanetwork.io",
    "https://testnet-au-server-1.somanetwork.io",
    "https://testnet-sg-server-1.somanetwork.io",
    "https://testnet-sg-server-2.somanetwork.io"
  ],
  "slug": "soma-network-testnet",
  "icon": {
    "url": "ipfs://QmadSU2tcyvuzssDYGJ4rVLag43QLnKwcBerZR2zKLVU2N",
    "width": 500,
    "height": 500,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "SOMA Testnet Explorer",
      "url": "https://testnet.somascan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;