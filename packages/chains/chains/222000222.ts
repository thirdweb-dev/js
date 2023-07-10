import type { Chain } from "../src/types";
export default {
  "name": "Kanazawa",
  "title": "Meld Testnet Kanazawa",
  "chain": "Kanazawa",
  "rpc": [
    "https://kanazawa.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/meld/testnet/rpc"
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
  "shortName": "kanazawa",
  "chainId": 222000222,
  "networkId": 222000222,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets-test.avax.network/meld",
      "icon": {
        "url": "ipfs://QmRhB4AbjDrhvwfSAQi2JvKirFiDWxzJvKEvG8S8AdDdED",
        "width": 4000,
        "height": 4000,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "kanazawa"
} as const satisfies Chain;