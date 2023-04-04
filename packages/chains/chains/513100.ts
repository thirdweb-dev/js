import type { Chain } from "../src/types";
export default {
  "name": "ethereum Fair",
  "chainId": 513100,
  "networkId": 513100,
  "shortName": "ethf",
  "chain": "ETHF",
  "nativeCurrency": {
    "name": "EthereumFair",
    "symbol": "ETHF",
    "decimals": 18
  },
  "rpc": [
    "https://ethereum-fair.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.etherfair.org"
  ],
  "faucets": [],
  "explorers": [
    {
      "name": "etherfair",
      "url": "https://www.oklink.com/ethf",
      "standard": "EIP3091"
    }
  ],
  "infoURL": "https://etherfair.org",
  "testnet": false,
  "slug": "ethereum-fair"
} as const satisfies Chain;