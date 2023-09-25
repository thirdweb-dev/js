import type { Chain } from "../src/types";
export default {
  "chainId": 55004,
  "chain": "ETH",
  "name": "Titan",
  "rpc": [
    "https://titan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.titan.tokamak.network",
    "wss://rpc.titan.tokamak.network"
  ],
  "slug": "titan",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://tokamak.network",
  "shortName": "teth",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.titan.tokamak.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;