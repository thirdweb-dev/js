import type { Chain } from "../src/types";
export default {
  "chain": "Kanazawa",
  "chainId": 222000222,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets-test.avax.network/meld",
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
  "name": "Kanazawa",
  "nativeCurrency": {
    "name": "gMeld",
    "symbol": "gMELD",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://kanazawa.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/meld/testnet/rpc"
  ],
  "shortName": "kanazawa",
  "slug": "kanazawa",
  "testnet": true
} as const satisfies Chain;