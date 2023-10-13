import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 255,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.kroma.network",
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
  "name": "Kroma",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://kroma.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.kroma.network"
  ],
  "shortName": "kroma",
  "slug": "kroma",
  "testnet": false
} as const satisfies Chain;