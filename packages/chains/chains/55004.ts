import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 55004,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.titan.tokamak.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://tokamak.network",
  "name": "Titan",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://titan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.titan.tokamak.network",
    "wss://rpc.titan.tokamak.network"
  ],
  "shortName": "teth",
  "slug": "titan",
  "testnet": false
} as const satisfies Chain;