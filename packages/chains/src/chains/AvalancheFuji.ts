import type { Chain } from "../types";
export default {
  "chain": "AVAX",
  "chainId": 43113,
  "explorers": [
    {
      "name": "snowtrace",
      "url": "https://testnet.snowtrace.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.avax-test.network/",
    "https://faucet.avax.network/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/avalanche/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://cchain.explorer.avax-test.network",
  "name": "Avalanche Fuji Testnet",
  "nativeCurrency": {
    "name": "Avalanche",
    "symbol": "AVAX",
    "decimals": 18
  },
  "networkId": 43113,
  "redFlags": [],
  "rpc": [
    "https://avalanche-fuji.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://43113.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://avalanche-fuji.infura.io/v3/${INFURA_API_KEY}",
    "https://api.avax-test.network/ext/bc/C/rpc",
    "https://avalanche-fuji-c-chain.publicnode.com",
    "wss://avalanche-fuji-c-chain.publicnode.com"
  ],
  "shortName": "Fuji",
  "slug": "avalanche-fuji",
  "testnet": false
} as const satisfies Chain;