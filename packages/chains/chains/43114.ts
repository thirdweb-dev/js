import type { Chain } from "../src/types";
export default {
  "chainId": 43114,
  "chain": "AVAX",
  "name": "Avalanche C-Chain",
  "rpc": [
    "https://avalanche.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://avalanche-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://api.avax.network/ext/bc/C/rpc",
    "https://avalanche-c-chain.publicnode.com",
    "wss://avalanche-c-chain.publicnode.com"
  ],
  "slug": "avalanche",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/avalanche/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Avalanche",
    "symbol": "AVAX",
    "decimals": 18
  },
  "infoURL": "https://www.avax.network/",
  "shortName": "avax",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "snowtrace",
      "url": "https://snowtrace.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;