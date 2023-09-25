import type { Chain } from "../src/types";
export default {
  "chainId": 1230,
  "chain": "Ultron",
  "name": "Ultron Testnet",
  "rpc": [
    "https://ultron-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ultron-dev.io"
  ],
  "slug": "ultron-testnet",
  "icon": {
    "url": "ipfs://QmPC6odFVyAQrXJQaZJVFpEQfRNbzZ5BjDZ7KBKmXPaYDw",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ultron",
    "symbol": "ULX",
    "decimals": 18
  },
  "infoURL": "https://ultron.foundation",
  "shortName": "UltronTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Ultron Testnet Explorer",
      "url": "https://explorer.ultron-dev.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;