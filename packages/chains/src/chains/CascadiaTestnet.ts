import type { Chain } from "../types";
export default {
  "chain": "Cascadia",
  "chainId": 6102,
  "explorers": [
    {
      "name": "Cascadia EVM Explorer",
      "url": "https://explorer.cascadia.foundation",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmQtcwxNiJ9D1QDz4k6jZ7qacLcqMk6CeW85TTBWBvNp3z",
        "width": 256,
        "height": 256,
        "format": "png"
      }
    },
    {
      "name": "Cascadia Cosmos Explorer",
      "url": "https://validator.cascadia.foundation",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmQtcwxNiJ9D1QDz4k6jZ7qacLcqMk6CeW85TTBWBvNp3z",
        "width": 256,
        "height": 256,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://www.cascadia.foundation/faucet"
  ],
  "icon": {
    "url": "ipfs://QmQtcwxNiJ9D1QDz4k6jZ7qacLcqMk6CeW85TTBWBvNp3z",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://www.cascadia.foundation",
  "name": "Cascadia Testnet",
  "nativeCurrency": {
    "name": "CC",
    "symbol": "tCC",
    "decimals": 18
  },
  "networkId": 6102,
  "rpc": [
    "https://cascadia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6102.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.cascadia.foundation"
  ],
  "shortName": "cascadia",
  "slug": "cascadia-testnet",
  "testnet": true
} as const satisfies Chain;