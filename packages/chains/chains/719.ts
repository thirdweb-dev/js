import type { Chain } from "../src/types";
export default {
  "chainId": 719,
  "chain": "Shibarium",
  "name": "Shibarium Beta",
  "rpc": [
    "https://shibarium-beta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://puppynet.shibrpc.com"
  ],
  "slug": "shibarium-beta",
  "icon": {
    "url": "ipfs://QmYNVkoZgRjDBQzJz6kog9mA2yPzQFW2oSKvhnkwuBhLQE",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "BONE",
    "symbol": "BONE",
    "decimals": 18
  },
  "infoURL": "https://beta.shibariumtech.com",
  "shortName": "shibarium",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "shibscan",
      "url": "https://puppyscan.shib.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;