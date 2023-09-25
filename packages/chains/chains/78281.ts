import type { Chain } from "../src/types";
export default {
  "chainId": 78281,
  "chain": "Dragonfly",
  "name": "Dragonfly Mainnet (Hexapod)",
  "rpc": [
    "https://dragonfly-hexapod.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dragonfly-rpc.switch.ch",
    "https://dragonfly-rpc.kore-technologies.ch",
    "https://dragonfly-rpc.phoenix-systems.io",
    "https://dragonfly-rpc.block-spirit.ch"
  ],
  "slug": "dragonfly-hexapod",
  "icon": {
    "url": "ipfs://QmPXhdPGufjcPzZ9Y6nY6QyW8MgA6793L88iPMRh1Q3gjJ",
    "width": 512,
    "height": 366,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Dragonfly",
    "symbol": "DFLY",
    "decimals": 18
  },
  "infoURL": "https://hexapod.network",
  "shortName": "dfly",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Dragonfly Blockscout",
      "url": "https://blockscout.dragonfly.hexapod.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;