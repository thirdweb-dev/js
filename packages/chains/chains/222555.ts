import type { Chain } from "../src/types";
export default {
  "chain": "DEEPL",
  "chainId": 222555,
  "explorers": [
    {
      "name": "DeepL Mainnet Explorer",
      "url": "https://scan.deeplnetwork.org",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafybeihjwgy4qja5cee452malk5hpb25pzpipfaka7hjcyb437ldodxzaq",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://bafybeihjwgy4qja5cee452malk5hpb25pzpipfaka7hjcyb437ldodxzaq",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://deeplnetwork.org",
  "name": "DeepL Mainnet",
  "nativeCurrency": {
    "name": "DeepL",
    "symbol": "DEEPL",
    "decimals": 18
  },
  "networkId": 222555,
  "rpc": [
    "https://222555.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.deeplnetwork.org"
  ],
  "shortName": "deepl",
  "slug": "deepl",
  "testnet": false
} as const satisfies Chain;