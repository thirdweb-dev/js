import type { Chain } from "../src/types";
export default {
  "chain": "Debounce Network",
  "chainId": 3306,
  "explorers": [
    {
      "name": "Debounce Devnet Explorer",
      "url": "https://explorer.debounce.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeib5q4hez37s7b2fx4hqt2q4ji2tuudxjhfdgnp6q3d5mqm6wsxdfq",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://debounce.network",
  "name": "Debounce Subnet Testnet",
  "nativeCurrency": {
    "name": "Debounce Network",
    "symbol": "DB",
    "decimals": 18
  },
  "networkId": 3306,
  "rpc": [
    "https://debounce-subnet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3306.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dev-rpc.debounce.network"
  ],
  "shortName": "debounce-devnet",
  "slug": "debounce-subnet-testnet",
  "testnet": true
} as const satisfies Chain;