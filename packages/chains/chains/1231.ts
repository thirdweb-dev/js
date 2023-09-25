import type { Chain } from "../src/types";
export default {
  "chainId": 1231,
  "chain": "Ultron",
  "name": "Ultron Mainnet",
  "rpc": [
    "https://ultron.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ultron-rpc.net"
  ],
  "slug": "ultron",
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
  "shortName": "UtronMainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Ultron Explorer",
      "url": "https://ulxscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;