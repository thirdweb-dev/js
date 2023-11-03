import type { Chain } from "../types";
export default {
  "chain": "MELD",
  "chainId": 333000333,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets.avax.network/meld",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRhB4AbjDrhvwfSAQi2JvKirFiDWxzJvKEvG8S8AdDdED",
        "width": 4000,
        "height": 4000,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmRhB4AbjDrhvwfSAQi2JvKirFiDWxzJvKEvG8S8AdDdED",
    "width": 4000,
    "height": 4000,
    "format": "png"
  },
  "infoURL": "https://meld.com",
  "name": "Meld",
  "nativeCurrency": {
    "name": "gMeld",
    "symbol": "gMELD",
    "decimals": 18
  },
  "networkId": 333000333,
  "rpc": [
    "https://meld.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://333000333.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/meld/mainnet/rpc"
  ],
  "shortName": "meld",
  "slug": "meld",
  "testnet": false,
  "title": "Meld Mainnet"
} as const satisfies Chain;