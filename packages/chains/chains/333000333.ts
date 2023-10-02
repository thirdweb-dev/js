import type { Chain } from "../src/types";
export default {
  "chain": "MELD",
  "chainId": 333000333,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets.avax.network/meld",
      "standard": "EIP3091"
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
  "redFlags": [],
  "rpc": [
    "https://meld.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/meld/mainnet/rpc"
  ],
  "shortName": "meld",
  "slug": "meld",
  "testnet": false
} as const satisfies Chain;