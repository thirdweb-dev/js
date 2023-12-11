import type { Chain } from "../src/types";
export default {
  "chain": "TQF",
  "chainId": 8194,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.toruscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreidchntjaxmq52cuqqoalpajk5ssk4p77k7n4jgywqmkpldo5qgobm",
    "width": 1200,
    "height": 1200,
    "format": "png"
  },
  "infoURL": "https://docs.toruschain.com",
  "name": "Torus Testnet",
  "nativeCurrency": {
    "name": "tTQF",
    "symbol": "TTQF",
    "decimals": 18
  },
  "networkId": 8194,
  "rpc": [
    "https://torus-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8194.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.toruschain.com"
  ],
  "shortName": "ttqf",
  "slug": "torus-testnet",
  "testnet": true
} as const satisfies Chain;