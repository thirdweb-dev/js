import type { Chain } from "../src/types";
export default {
  "chain": "Karak",
  "chainId": 2511,
  "explorers": [
    {
      "name": "Karak Testnet Explorer",
      "url": "https://goerli.scan.karak.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRvHRuhfQgDRyGgt6vCoHqjZW2Dir7siowYnBpR5BRSej",
    "width": 1080,
    "height": 1080,
    "format": "png"
  },
  "infoURL": "https://karak.network",
  "name": "Karak Testnet",
  "nativeCurrency": {
    "name": "Karak",
    "symbol": "KRK",
    "decimals": 18
  },
  "networkId": 2511,
  "parent": {
    "type": "L2",
    "chain": "eip155-5"
  },
  "rpc": [
    "https://2511.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.node1.karak.network"
  ],
  "shortName": "karak-testnet",
  "slug": "karak-testnet",
  "testnet": true
} as const satisfies Chain;