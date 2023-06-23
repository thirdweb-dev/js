import type { Chain } from "../src/types";
export default {
  "name": "Shibarium Beta",
  "chain": "Shibarium",
  "icon": {
    "url": "ipfs://QmYNVkoZgRjDBQzJz6kog9mA2yPzQFW2oSKvhnkwuBhLQE",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "rpc": [
    "https://shibarium-beta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://puppynet.shibrpc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BONE",
    "symbol": "BONE",
    "decimals": 18
  },
  "infoURL": "https://beta.shibariumtech.com",
  "shortName": "shibarium",
  "chainId": 719,
  "networkId": 719,
  "explorers": [
    {
      "name": "shibscan",
      "url": "https://puppyscan.shib.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "shibarium-beta"
} as const satisfies Chain;