import type { Chain } from "../src/types";
export default {
  "chainId": 333000333,
  "chain": "MELD",
  "name": "Meld",
  "rpc": [
    "https://meld.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/meld/mainnet/rpc"
  ],
  "slug": "meld",
  "icon": {
    "url": "ipfs://QmRhB4AbjDrhvwfSAQi2JvKirFiDWxzJvKEvG8S8AdDdED",
    "width": 4000,
    "height": 4000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "gMeld",
    "symbol": "gMELD",
    "decimals": 18
  },
  "infoURL": "https://meld.com",
  "shortName": "meld",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets.avax.network/meld",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;