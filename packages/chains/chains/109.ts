import type { Chain } from "../src/types";
export default {
  "name": "Shibarium",
  "chain": "Shibarium",
  "icon": {
    "url": "ipfs://QmYNVkoZgRjDBQzJz6kog9mA2yPzQFW2oSKvhnkwuBhLQE",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "rpc": [
    "https://shibarium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.shibrpc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BONE Shibarium",
    "symbol": "BONE",
    "decimals": 18
  },
  "infoURL": "https://shibariumecosystem.com",
  "shortName": "shibariumecosystem",
  "chainId": 109,
  "networkId": 109,
  "explorers": [
    {
      "name": "shibariumscan",
      "url": "https://www.shibariumscan.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "shibarium"
} as const satisfies Chain;