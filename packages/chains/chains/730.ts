import type { Chain } from "../src/types";
export default {
  "chain": "Lovely",
  "chainId": 730,
  "explorers": [
    {
      "name": "Lovely Network Mainnet",
      "url": "https://scan.lovely.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPB7uW7Wj8zWWdeuPnUHPJ5FhaiTL76tv4ZQ4oKWEpb1g",
    "width": 897,
    "height": 824,
    "format": "png"
  },
  "infoURL": "https://lovely.network",
  "name": "Lovely Network Mainnet",
  "nativeCurrency": {
    "name": "Lovely",
    "symbol": "LOVELY",
    "decimals": 18
  },
  "networkId": 730,
  "rpc": [
    "https://lovely-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://730.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lovely.network"
  ],
  "shortName": "LOVELY",
  "slug": "lovely-network",
  "testnet": false
} as const satisfies Chain;