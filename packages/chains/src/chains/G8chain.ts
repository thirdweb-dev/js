import type { Chain } from "../types";
export default {
  "chain": "G8C",
  "chainId": 17171,
  "explorers": [
    {
      "name": "G8Chain",
      "url": "https://mainnet.oneg8.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.oneg8.network"
  ],
  "icon": {
    "url": "ipfs://QmbkCVC5vZpVAfq8SuPXR9PhpTRS2m8w6LGqBkhXAvmie6",
    "width": 80,
    "height": 80,
    "format": "png"
  },
  "infoURL": "https://oneg8.one",
  "name": "G8Chain Mainnet",
  "nativeCurrency": {
    "name": "G8Chain",
    "symbol": "G8C",
    "decimals": 18
  },
  "networkId": 17171,
  "rpc": [
    "https://g8chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://17171.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.oneg8.network"
  ],
  "shortName": "G8Cm",
  "slug": "g8chain",
  "testnet": false
} as const satisfies Chain;