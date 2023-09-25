import type { Chain } from "../src/types";
export default {
  "chainId": 109,
  "chain": "Shibarium",
  "name": "Shibarium",
  "rpc": [
    "https://shibarium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.shibrpc.com"
  ],
  "slug": "shibarium",
  "icon": {
    "url": "ipfs://QmYNVkoZgRjDBQzJz6kog9mA2yPzQFW2oSKvhnkwuBhLQE",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "BONE Shibarium",
    "symbol": "BONE",
    "decimals": 18
  },
  "infoURL": "https://shibariumecosystem.com",
  "shortName": "shibariumecosystem",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "shibariumscan",
      "url": "https://www.shibariumscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;