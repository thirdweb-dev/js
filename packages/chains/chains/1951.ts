import type { Chain } from "../src/types";
export default {
  "chainId": 1951,
  "chain": "D-Chain",
  "name": "D-Chain Mainnet",
  "rpc": [
    "https://d-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.d-chain.network/ext/bc/2ZiR1Bro5E59siVuwdNuRFzqL95NkvkbzyLBdrsYR9BLSHV7H4/rpc"
  ],
  "slug": "d-chain",
  "icon": {
    "url": "ipfs://QmV2vhTqS9UyrX9Q6BSCbK4JrKBnS8ErHvstMjfb2oVWaj",
    "width": 700,
    "height": 495,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "DOINX",
    "symbol": "DOINX",
    "decimals": 18
  },
  "shortName": "dchain-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;