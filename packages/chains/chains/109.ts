import type { Chain } from "../src/types";
export default {
  "chain": "Shibarium",
  "chainId": 109,
  "explorers": [
    {
      "name": "shibariumscan",
      "url": "https://www.shibariumscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYNVkoZgRjDBQzJz6kog9mA2yPzQFW2oSKvhnkwuBhLQE",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://shibariumecosystem.com",
  "name": "Shibarium",
  "nativeCurrency": {
    "name": "BONE Shibarium",
    "symbol": "BONE",
    "decimals": 18
  },
  "networkId": 109,
  "rpc": [
    "https://109.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.shibrpc.com"
  ],
  "shortName": "shibariumecosystem",
  "slug": "shibarium",
  "testnet": false
} as const satisfies Chain;