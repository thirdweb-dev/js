import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 255,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.kroma.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    },
    {
      "name": "etherscan",
      "url": "https://kromascan.com/",
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
  "networkId": 255,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://kroma.network/bridge"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://kroma.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://255.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.kroma.network"
  ],
  "shortName": "kroma",
  "slug": "kroma",
  "testnet": false
} as const satisfies Chain;