import type { Chain } from "../src/types";
export default {
  "chainId": 6102,
  "chain": "Cascadia",
  "name": "Cascadia Testnet",
  "rpc": [
    "https://cascadia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.cascadia.foundation"
  ],
  "slug": "cascadia-testnet",
  "icon": {
    "url": "ipfs://QmQtcwxNiJ9D1QDz4k6jZ7qacLcqMk6CeW85TTBWBvNp3z",
    "width": 256,
    "height": 256,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Cascadia Cosmos Explorer",
      "url": "https://validator.cascadia.foundation",
      "standard": "none"
    },
    {
      "name": "Cascadia EVM Explorer",
      "url": "https://explorer.cascadia.foundation",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;