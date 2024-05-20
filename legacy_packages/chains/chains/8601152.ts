import type { Chain } from "../src/types";
export default {
  "chain": "Waterfall Testnet8",
  "chainId": 8601152,
  "explorers": [],
  "faucets": [
    "https://faucet.testnet8.waterfall.network"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmSDJPBKh9cLVL8UZ5KYwdwPyhD8bRWNb33jjt48wtu5Uc",
    "width": 241,
    "height": 179,
    "format": "png"
  },
  "infoURL": "https://waterfall.network",
  "name": "Waterfall 8 Test Network",
  "nativeCurrency": {
    "name": "WATER",
    "symbol": "WATER",
    "decimals": 18
  },
  "networkId": 8601152,
  "rpc": [
    "https://8601152.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet8.waterfall.network/"
  ],
  "shortName": "waterfall",
  "slug": "waterfall-8-test-network",
  "testnet": true
} as const satisfies Chain;