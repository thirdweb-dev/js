import type { Chain } from "../src/types";
export default {
  "chain": "ETHF",
  "chainId": 513100,
  "explorers": [
    {
      "name": "etherfair",
      "url": "https://www.oklink.com/ethf",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://etherfair.org",
  "name": "ethereum Fair",
  "nativeCurrency": {
    "name": "EthereumFair",
    "symbol": "ETHF",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ethereum-fair.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.etherfair.org"
  ],
  "shortName": "ethf",
  "slug": "ethereum-fair",
  "testnet": false
} as const satisfies Chain;