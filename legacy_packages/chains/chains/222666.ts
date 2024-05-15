import type { Chain } from "../src/types";
export default {
  "chain": "DEEPL",
  "chainId": 222666,
  "explorers": [
    {
      "name": "DeepL Testnet Explorer",
      "url": "https://testnet-scan.deeplnetwork.org",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafybeihjwgy4qja5cee452malk5hpb25pzpipfaka7hjcyb437ldodxzaq",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.deeplnetwork.org"
  ],
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
  "name": "DeepL Testnet",
  "nativeCurrency": {
    "name": "DeepL",
    "symbol": "DEEPL",
    "decimals": 18
  },
  "networkId": 222666,
  "rpc": [
    "https://222666.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.deeplnetwork.org"
  ],
  "shortName": "tdeepl",
  "slug": "deepl-testnet",
  "testnet": true
} as const satisfies Chain;