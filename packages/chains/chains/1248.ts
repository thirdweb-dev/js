import type { Chain } from "../src/types";
export default {
  "chain": "Dogether",
  "chainId": 1248,
  "explorers": [
    {
      "name": "DogetherExplorer",
      "url": "https://explorer.dogether.dog",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.dogether.dog/",
  "name": "Dogether Mainnet",
  "nativeCurrency": {
    "name": "Dogether",
    "symbol": "dogeth",
    "decimals": 18
  },
  "networkId": 1248,
  "rpc": [
    "https://dogether.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1248.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dogether.dog/"
  ],
  "shortName": "Dogether",
  "slug": "dogether",
  "testnet": false
} as const satisfies Chain;