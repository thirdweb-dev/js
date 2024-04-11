import type { Chain } from "../src/types";
export default {
  "chain": "DreyerX",
  "chainId": 23451,
  "explorers": [
    {
      "name": "drxscan",
      "url": "https://scan.dreyerx.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmTGjVbiSdHYhjzpeqzY6fGwGiLQuEa2hW7irD75sUSx9e",
        "width": 4501,
        "height": 4501,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTGjVbiSdHYhjzpeqzY6fGwGiLQuEa2hW7irD75sUSx9e",
    "width": 4501,
    "height": 4501,
    "format": "png"
  },
  "infoURL": "https://dreyerx.com",
  "name": "DreyerX Mainnet",
  "nativeCurrency": {
    "name": "DreyerX",
    "symbol": "DRX",
    "decimals": 18
  },
  "networkId": 23451,
  "rpc": [
    "https://23451.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dreyerx.com"
  ],
  "shortName": "dreyerx",
  "slug": "dreyerx",
  "testnet": false
} as const satisfies Chain;