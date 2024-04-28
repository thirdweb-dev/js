import type { Chain } from "../src/types";
export default {
  "chain": "VERY Mainnet",
  "chainId": 4613,
  "explorers": [
    {
      "name": "VERY explorer",
      "url": "https://www.veryscan.io",
      "standard": "none"
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
    "url": "ipfs://bafkreih6nnkha6t3oiy6qkqpgyb46p3ddg5nff5ayizpum2ljexlc3gc54",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "infoURL": "https://www.verylabs.io/",
  "name": "VERY Mainnet",
  "nativeCurrency": {
    "name": "VERY",
    "symbol": "VERY",
    "decimals": 18
  },
  "networkId": 4613,
  "rpc": [
    "https://4613.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.verylabs.io"
  ],
  "shortName": "very",
  "slug": "very",
  "testnet": false,
  "title": "VERY Mainnet"
} as const satisfies Chain;