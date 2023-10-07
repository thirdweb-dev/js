import type { Chain } from "../src/types";
export default {
  "chain": "Ultron",
  "chainId": 1230,
  "explorers": [
    {
      "name": "Ultron Testnet Explorer",
      "url": "https://explorer.ultron-dev.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
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
  "redFlags": [],
  "rpc": [
    "https://ultron-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ultron-dev.io"
  ],
  "shortName": "UltronTestnet",
  "slug": "ultron-testnet",
  "testnet": true
} as const satisfies Chain;