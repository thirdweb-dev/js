import type { Chain } from "../src/types";
export default {
  "chain": "Merlin",
  "chainId": 4200,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.merlinchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://merlinchain.io",
  "name": "Merlin Mainnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 4200,
  "rpc": [
    "https://4200.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.merlinchain.io"
  ],
  "shortName": "Merlin-Mainnet",
  "slug": "merlin",
  "testnet": false,
  "title": "Merlin Mainnet"
} as const satisfies Chain;