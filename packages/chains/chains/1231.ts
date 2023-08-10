import type { Chain } from "../src/types";
export default {
  "name": "Ultron Mainnet",
  "chain": "Ultron",
  "icon": {
    "url": "ipfs://QmPC6odFVyAQrXJQaZJVFpEQfRNbzZ5BjDZ7KBKmXPaYDw",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://ultron.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ultron-rpc.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ultron",
    "symbol": "ULX",
    "decimals": 18
  },
  "infoURL": "https://ultron.foundation",
  "shortName": "UtronMainnet",
  "chainId": 1231,
  "networkId": 1231,
  "explorers": [
    {
      "name": "Ultron Explorer",
      "url": "https://ulxscan.com",
      "icon": {
        "url": "ipfs://QmPC6odFVyAQrXJQaZJVFpEQfRNbzZ5BjDZ7KBKmXPaYDw",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "ultron"
} as const satisfies Chain;