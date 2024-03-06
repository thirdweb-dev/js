import type { Chain } from "../src/types";
export default {
  "chain": "Lovely",
  "chainId": 307,
  "explorers": [
    {
      "name": "Lovely Network Testnet",
      "url": "https://tscan.lovely.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.lovely.network"
  ],
  "icon": {
    "url": "ipfs://QmPB7uW7Wj8zWWdeuPnUHPJ5FhaiTL76tv4ZQ4oKWEpb1g",
    "width": 897,
    "height": 824,
    "format": "png"
  },
  "infoURL": "https://lovely.network",
  "name": "Lovely Network Testnet",
  "nativeCurrency": {
    "name": "Lovely",
    "symbol": "LOVELY",
    "decimals": 18
  },
  "networkId": 307,
  "rpc": [
    "https://307.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://trpc.lovely.network"
  ],
  "shortName": "LOVELY-Testnet",
  "slug": "lovely-network-testnet",
  "testnet": true
} as const satisfies Chain;