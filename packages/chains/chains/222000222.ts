import type { Chain } from "../src/types";
export default {
  "chain": "Kanazawa",
  "chainId": 222000222,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://testnet.meldscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRhB4AbjDrhvwfSAQi2JvKirFiDWxzJvKEvG8S8AdDdED",
        "width": 4000,
        "height": 4000,
        "format": "png"
      }
    },
    {
      "name": "explorer",
      "url": "https://subnets-test.avax.network/meld",
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
  "name": "Kanazawa",
  "nativeCurrency": {
    "name": "gMeld",
    "symbol": "gMELD",
    "decimals": 18
  },
  "networkId": 222000222,
  "rpc": [
    "https://kanazawa.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://222000222.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.meld.com"
  ],
  "shortName": "kanazawa",
  "slip44": 1,
  "slug": "kanazawa",
  "testnet": true,
  "title": "Meld Testnet Kanazawa"
} as const satisfies Chain;