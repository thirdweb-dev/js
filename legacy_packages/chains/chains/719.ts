import type { Chain } from "../src/types";
export default {
  "chain": "Shibarium",
  "chainId": 719,
  "explorers": [
    {
      "name": "shibscan",
      "url": "https://puppyscan.shib.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYNVkoZgRjDBQzJz6kog9mA2yPzQFW2oSKvhnkwuBhLQE",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://beta.shibariumtech.com",
  "name": "Shibarium Beta",
  "nativeCurrency": {
    "name": "BONE",
    "symbol": "BONE",
    "decimals": 18
  },
  "networkId": 719,
  "rpc": [
    "https://719.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://puppynet.shibrpc.com"
  ],
  "shortName": "shibarium",
  "slug": "shibarium-beta",
  "testnet": false
} as const satisfies Chain;