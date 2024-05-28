import type { Chain } from "../src/types";
export default {
  "chain": "D-Chain",
  "chainId": 1951,
  "explorers": [],
  "faucets": [],
  "name": "D-Chain Mainnet",
  "nativeCurrency": {
    "name": "DOINX",
    "symbol": "DOINX",
    "decimals": 18
  },
  "networkId": 1951,
  "rpc": [
    "https://1951.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.d-chain.network/ext/bc/2ZiR1Bro5E59siVuwdNuRFzqL95NkvkbzyLBdrsYR9BLSHV7H4/rpc"
  ],
  "shortName": "dchain-mainnet",
  "slug": "d-chain",
  "testnet": false
} as const satisfies Chain;