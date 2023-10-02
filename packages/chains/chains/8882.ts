import type { Chain } from "../src/types";
export default {
  "chain": "UNQ",
  "chainId": 8882,
  "explorers": [
    {
      "name": "Unique Scan / Opal",
      "url": "https://uniquescan.io/opal",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://t.me/unique2faucet_opal_bot"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmYJDpmWyjDa3H6BxweFmQXk4fU8b1GU7M9EqYcaUNvXzc",
    "width": 48,
    "height": 48,
    "format": "svg"
  },
  "infoURL": "https://unique.network",
  "name": "Opal testnet by Unique",
  "nativeCurrency": {
    "name": "Opal",
    "symbol": "UNQ",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://opal-testnet-by-unique.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-opal.unique.network",
    "https://us-rpc-opal.unique.network",
    "https://eu-rpc-opal.unique.network",
    "https://asia-rpc-opal.unique.network"
  ],
  "shortName": "opl",
  "slug": "opal-testnet-by-unique",
  "testnet": true
} as const satisfies Chain;