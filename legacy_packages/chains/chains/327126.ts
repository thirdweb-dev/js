import type { Chain } from "../src/types";
export default {
  "chain": "WABA Testnet",
  "chainId": 327126,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.wabaworld.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmX3NPsVTaBQDBySzMKZLVJhN4kakkAwrfz9mrqmUhNzUU",
    "width": 32,
    "height": 32,
    "format": "png"
  },
  "infoURL": "https://www.wabanetwork.org",
  "name": "WABA Chain Testnet",
  "nativeCurrency": {
    "name": "WABA",
    "symbol": "WABA",
    "decimals": 18
  },
  "networkId": 327126,
  "rpc": [
    "https://327126.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.wabaworld.com"
  ],
  "shortName": "waba",
  "slug": "waba-chain-testnet",
  "testnet": true
} as const satisfies Chain;