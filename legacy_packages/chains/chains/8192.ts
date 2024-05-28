import type { Chain } from "../src/types";
export default {
  "chain": "TQF",
  "chainId": 8192,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://toruscan.com",
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
  "name": "Torus Mainnet",
  "nativeCurrency": {
    "name": "TQF",
    "symbol": "TQF",
    "decimals": 18
  },
  "networkId": 8192,
  "rpc": [
    "https://8192.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.toruschain.com"
  ],
  "shortName": "tqf",
  "slug": "torus",
  "testnet": false
} as const satisfies Chain;