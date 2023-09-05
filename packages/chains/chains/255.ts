import type { Chain } from "../src/types";
export default {
  "name": "Kroma",
  "chain": "ETH",
  "rpc": [
    "https://kroma.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.kroma.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://kroma.network",
  "icon": {
    "url": "ipfs://QmVpV2WET6ZrqnvvPfE9hCwoE2y5ygbPuniuugpaRoxrho",
    "width": 320,
    "height": 320,
    "format": "svg"
  },
  "shortName": "kroma",
  "chainId": 255,
  "networkId": 255,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.kroma.network",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://kroma.network/bridge"
      }
    ]
  },
  "testnet": false,
  "slug": "kroma"
} as const satisfies Chain;