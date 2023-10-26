import type { Chain } from "../src/types";
export default {
  "chain": "AVAX",
  "chainId": 43114,
  "explorers": [
    {
      "name": "snowtrace",
      "url": "https://snowtrace.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/avalanche/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.avax.network/",
  "name": "Avalanche C-Chain",
  "nativeCurrency": {
    "name": "Avalanche",
    "symbol": "AVAX",
    "decimals": 18
  },
  "networkId": 43114,
  "redFlags": [],
  "rpc": [
    "https://avalanche.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://43114.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://avalanche-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://api.avax.network/ext/bc/C/rpc",
    "https://avalanche-c-chain.publicnode.com",
    "wss://avalanche-c-chain.publicnode.com"
  ],
  "shortName": "avax",
  "slip44": 9005,
  "slug": "avalanche",
  "testnet": false
} as const satisfies Chain;