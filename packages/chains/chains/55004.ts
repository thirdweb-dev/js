import type { Chain } from "../src/types";
export default {
  "name": "Titan",
  "chain": "ETH",
  "rpc": [
    "https://titan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.titan.tokamak.network",
    "wss://rpc.titan.tokamak.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://tokamak.network",
  "shortName": "teth",
  "chainId": 55004,
  "networkId": 55004,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.titan.tokamak.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "titan"
} as const satisfies Chain;