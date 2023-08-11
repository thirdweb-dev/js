import type { Chain } from "../src/types";
export default {
  "name": "Dragonfly Mainnet (Hexapod)",
  "chain": "Dragonfly",
  "icon": {
    "url": "ipfs://QmPXhdPGufjcPzZ9Y6nY6QyW8MgA6793L88iPMRh1Q3gjJ",
    "width": 512,
    "height": 366,
    "format": "png"
  },
  "rpc": [
    "https://dragonfly-hexapod.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dragonfly-rpc.switch.ch",
    "https://dragonfly-rpc.kore-technologies.ch",
    "https://dragonfly-rpc.phoenix-systems.io",
    "https://dragonfly-rpc.block-spirit.ch"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dragonfly",
    "symbol": "DFLY",
    "decimals": 18
  },
  "infoURL": "https://hexapod.network",
  "shortName": "dfly",
  "chainId": 78281,
  "networkId": 78281,
  "explorers": [
    {
      "name": "Dragonfly Blockscout",
      "url": "https://blockscout.dragonfly.hexapod.network",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "dragonfly-hexapod"
} as const satisfies Chain;