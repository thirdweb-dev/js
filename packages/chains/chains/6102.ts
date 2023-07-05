import type { Chain } from "../src/types";
export default {
  "name": "Cascadia Testnet",
  "chain": "Cascadia",
  "rpc": [
    "https://cascadia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.cascadia.foundation"
  ],
  "faucets": [
    "https://www.cascadia.foundation/faucet"
  ],
  "nativeCurrency": {
    "name": "CC",
    "symbol": "tCC",
    "decimals": 18
  },
  "infoURL": "https://www.cascadia.foundation",
  "shortName": "cascadia",
  "chainId": 6102,
  "networkId": 6102,
  "icon": {
    "url": "ipfs://QmQtcwxNiJ9D1QDz4k6jZ7qacLcqMk6CeW85TTBWBvNp3z",
    "width": 256,
    "height": 256,
    "format": "png"
  },
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
  "testnet": true,
  "slug": "cascadia-testnet"
} as const satisfies Chain;