import type { Chain } from "../src/types";
export default {
  "chainId": 513100,
  "chain": "ETHF",
  "name": "ethereum Fair",
  "rpc": [
    "https://ethereum-fair.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.etherfair.org"
  ],
  "slug": "ethereum-fair",
  "faucets": [],
  "nativeCurrency": {
    "name": "EthereumFair",
    "symbol": "ETHF",
    "decimals": 18
  },
  "infoURL": "https://etherfair.org",
  "shortName": "ethf",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "etherfair",
      "url": "https://www.oklink.com/ethf",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;