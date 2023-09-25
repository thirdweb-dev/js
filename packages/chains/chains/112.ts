import type { Chain } from "../src/types";
export default {
  "chainId": 112,
  "chain": "Coinbit",
  "name": "Coinbit Mainnet",
  "rpc": [
    "https://coinbit.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://coinbit-rpc-mainnet.chain.sbcrypto.app"
  ],
  "slug": "coinbit",
  "icon": {
    "url": "ipfs://QmdaQRUbAXJGfHeJ8jaB8WVh8CCmHExq8VjvAfXpLWWQEo",
    "width": 760,
    "height": 760,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Gas IDR",
    "symbol": "GIDR",
    "decimals": 18
  },
  "infoURL": "https://crypto.stockbit.com/",
  "shortName": "coinbit",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coinbit-explorer.chain.sbcrypto.app",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;