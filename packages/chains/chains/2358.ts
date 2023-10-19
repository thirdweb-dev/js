import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 2358,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.sepolia.kroma.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmVpV2WET6ZrqnvvPfE9hCwoE2y5ygbPuniuugpaRoxrho",
    "width": 320,
    "height": 320,
    "format": "svg"
  },
  "infoURL": "https://kroma.network",
  "name": "Kroma Sepolia",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://kroma-sepolia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.sepolia.kroma.network"
  ],
  "shortName": "kroma-sepolia",
  "slug": "kroma-sepolia",
  "testnet": true
} as const satisfies Chain;