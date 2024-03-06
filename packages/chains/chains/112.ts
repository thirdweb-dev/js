import type { Chain } from "../src/types";
export default {
  "chain": "Coinbit",
  "chainId": 112,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coinbit-explorer.chain.sbcrypto.app",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmdaQRUbAXJGfHeJ8jaB8WVh8CCmHExq8VjvAfXpLWWQEo",
    "width": 760,
    "height": 760,
    "format": "png"
  },
  "infoURL": "https://crypto.stockbit.com/",
  "name": "Coinbit Mainnet",
  "nativeCurrency": {
    "name": "Gas IDR",
    "symbol": "GIDR",
    "decimals": 18
  },
  "networkId": 112,
  "rpc": [
    "https://112.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://coinbit-rpc-mainnet.chain.sbcrypto.app"
  ],
  "shortName": "coinbit",
  "slug": "coinbit",
  "testnet": false
} as const satisfies Chain;