import type { Chain } from "../src/types";
export default {
  "chainId": 2358,
  "chain": "ETH",
  "name": "Kroma Sepolia",
  "rpc": [
    "https://kroma-sepolia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.sepolia.kroma.network"
  ],
  "slug": "kroma-sepolia",
  "icon": {
    "url": "ipfs://QmVpV2WET6ZrqnvvPfE9hCwoE2y5ygbPuniuugpaRoxrho",
    "width": 320,
    "height": 320,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://kroma.network",
  "shortName": "kroma-sepolia",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.sepolia.kroma.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;