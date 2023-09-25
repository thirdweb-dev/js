import type { Chain } from "../src/types";
export default {
  "chainId": 222000222,
  "chain": "Kanazawa",
  "name": "Kanazawa",
  "rpc": [
    "https://kanazawa.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/meld/testnet/rpc"
  ],
  "slug": "kanazawa",
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
  "shortName": "kanazawa",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets-test.avax.network/meld",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;