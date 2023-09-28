import type { Chain } from "../src/types";
export default {
  "name": "Avalanche C-Chain",
  "chain": "AVAX",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/avalanche/512.png",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "rpc": [
    "https://avalanche.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://avalanche-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://api.avax.network/ext/bc/C/rpc",
    "https://avalanche-c-chain.publicnode.com",
    "wss://avalanche-c-chain.publicnode.com"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Avalanche",
    "symbol": "AVAX",
    "decimals": 18
  },
  "infoURL": "https://www.avax.network/",
  "shortName": "avax",
  "chainId": 43114,
  "networkId": 43114,
  "slip44": 9005,
  "explorers": [
    {
      "name": "snowtrace",
      "url": "https://snowtrace.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "avalanche"
} as const satisfies Chain;