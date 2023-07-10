import type { Chain } from "../src/types";
export default {
  "name": "Coinbit Mainnet",
  "chain": "Coinbit",
  "rpc": [
    "https://coinbit.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://coinbit-rpc-mainnet.chain.sbcrypto.app"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gas IDR",
    "symbol": "GIDR",
    "decimals": 18
  },
  "infoURL": "https://crypto.stockbit.com/",
  "shortName": "coinbit",
  "chainId": 112,
  "networkId": 112,
  "icon": {
    "url": "ipfs://QmdaQRUbAXJGfHeJ8jaB8WVh8CCmHExq8VjvAfXpLWWQEo",
    "width": 760,
    "height": 760,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coinbit-explorer.chain.sbcrypto.app",
      "icon": {
        "url": "ipfs://bafybeifu5tpui7dk5cjoo54kde7pmuthvnl7sdykobuarsxgu7t2izurnq",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "coinbit"
} as const satisfies Chain;