import type { Chain } from "../src/types";
export default {
  "chainId": 255,
  "chain": "ETH",
  "name": "Kroma",
  "rpc": [
    "https://kroma.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.kroma.network"
  ],
  "slug": "kroma",
  "icon": {
    "url": "ipfs://QmVpV2WET6ZrqnvvPfE9hCwoE2y5ygbPuniuugpaRoxrho",
    "width": 320,
    "height": 320,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://kroma.network",
  "shortName": "kroma",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.kroma.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;