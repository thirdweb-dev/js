import type { Chain } from "../src/types";
export default {
  "chain": "Ultron",
  "chainId": 1230,
  "explorers": [
    {
      "name": "Ultron Testnet Explorer",
      "url": "https://explorer.ultron-dev.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmPC6odFVyAQrXJQaZJVFpEQfRNbzZ5BjDZ7KBKmXPaYDw",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPC6odFVyAQrXJQaZJVFpEQfRNbzZ5BjDZ7KBKmXPaYDw",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://ultron.foundation",
  "name": "Ultron Testnet",
  "nativeCurrency": {
    "name": "Ultron",
    "symbol": "ULX",
    "decimals": 18
  },
  "networkId": 1230,
  "rpc": [
    "https://ultron-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1230.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ultron-dev.io"
  ],
  "shortName": "UltronTestnet",
  "slug": "ultron-testnet",
  "testnet": true
} as const satisfies Chain;