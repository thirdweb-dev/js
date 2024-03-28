import type { Chain } from "../src/types";
export default {
  "chain": "WBT",
  "chainId": 1875,
  "explorers": [
    {
      "name": "whitechain-explorer",
      "url": "https://explorer.whitechain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmNeELax6vjkR9WZVmtggk8cam9xHVABZ4WvQyqkGCJ5qf",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://whitechain.io",
  "name": "Whitechain",
  "nativeCurrency": {
    "name": "WhiteBIT Coin",
    "symbol": "WBT",
    "decimals": 18
  },
  "networkId": 1875,
  "rpc": [
    "https://1875.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.whitechain.io"
  ],
  "shortName": "wbt",
  "slug": "whitechain",
  "testnet": false
} as const satisfies Chain;