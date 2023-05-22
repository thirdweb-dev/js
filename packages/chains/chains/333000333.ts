import type { Chain } from "../src/types";
export default {
  "name": "Meld",
  "title": "Meld Mainnet",
  "chain": "MELD",
  "rpc": [
    "https://meld.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/meld/mainnet/rpc"
  ],
  "faucets": [],
  "features": [],
  "nativeCurrency": {
    "name": "gMeld",
    "symbol": "gMELD",
    "decimals": 18
  },
  "icon": {
    "url": "ipfs://QmRhB4AbjDrhvwfSAQi2JvKirFiDWxzJvKEvG8S8AdDdED",
    "width": 4000,
    "height": 4000,
    "format": "png"
  },
  "infoURL": "https://meld.com",
  "shortName": "meld",
  "chainId": 333000333,
  "networkId": 333000333,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets.avax.network/meld",
      "icon": {
        "url": "ipfs://QmRhB4AbjDrhvwfSAQi2JvKirFiDWxzJvKEvG8S8AdDdED",
        "width": 4000,
        "height": 4000,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "meld"
} as const satisfies Chain;