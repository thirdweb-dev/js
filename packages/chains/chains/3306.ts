import type { Chain } from "../src/types";
export default {
  "chainId": 3306,
  "chain": "Debounce Network",
  "name": "Debounce Subnet Testnet",
  "rpc": [
    "https://debounce-subnet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dev-rpc.debounce.network"
  ],
  "slug": "debounce-subnet-testnet",
  "icon": {
    "url": "ipfs://bafybeib5q4hez37s7b2fx4hqt2q4ji2tuudxjhfdgnp6q3d5mqm6wsxdfq",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Debounce Network",
    "symbol": "DB",
    "decimals": 18
  },
  "infoURL": "https://debounce.network",
  "shortName": "debounce-devnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Debounce Devnet Explorer",
      "url": "https://explorer.debounce.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;