import type { Chain } from "../src/types";
export default {
  "chain": "VRD",
  "chainId": 422,
  "explorers": [
    {
      "name": "Viridis Mainnet",
      "url": "https://explorer.vrd.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://viridis.network",
  "name": "Viridis Mainnet",
  "nativeCurrency": {
    "name": "Viridis Token",
    "symbol": "VRD",
    "decimals": 18
  },
  "networkId": 422,
  "rpc": [
    "https://422.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.vrd.network"
  ],
  "shortName": "vrd",
  "slug": "viridis",
  "testnet": false
} as const satisfies Chain;