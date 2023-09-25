import type { Chain } from "../src/types";
export default {
  "chainId": 43113,
  "chain": "AVAX",
  "name": "Avalanche Fuji Testnet",
  "rpc": [
    "https://avalanche-fuji.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://avalanche-fuji.infura.io/v3/${INFURA_API_KEY}",
    "https://api.avax-test.network/ext/bc/C/rpc",
    "https://avalanche-fuji-c-chain.publicnode.com",
    "wss://avalanche-fuji-c-chain.publicnode.com"
  ],
  "slug": "avalanche-fuji",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/avalanche/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.avax.network/",
    "https://faucet.avax-test.network/"
  ],
  "nativeCurrency": {
    "name": "Avalanche",
    "symbol": "AVAX",
    "decimals": 18
  },
  "infoURL": "https://cchain.explorer.avax-test.network",
  "shortName": "Fuji",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "snowtrace",
      "url": "https://testnet.snowtrace.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;