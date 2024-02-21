import type { Chain } from "../src/types";
export default {
  "chain": "Dragonfly",
  "chainId": 78281,
  "explorers": [
    {
      "name": "Dragonfly Blockscout",
      "url": "https://blockscout.dragonfly.hexapod.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPXhdPGufjcPzZ9Y6nY6QyW8MgA6793L88iPMRh1Q3gjJ",
    "width": 512,
    "height": 366,
    "format": "png"
  },
  "infoURL": "https://hexapod.network",
  "name": "Dragonfly Mainnet (Hexapod)",
  "nativeCurrency": {
    "name": "Dragonfly",
    "symbol": "DFLY",
    "decimals": 18
  },
  "networkId": 78281,
  "rpc": [
    "https://78281.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dragonfly-rpc.switch.ch",
    "https://dragonfly-rpc.kore-technologies.ch",
    "https://dragonfly-rpc.phoenix-systems.io",
    "https://dragonfly-rpc.block-spirit.ch"
  ],
  "shortName": "dfly",
  "slug": "dragonfly-hexapod",
  "testnet": false
} as const satisfies Chain;