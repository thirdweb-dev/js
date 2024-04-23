import type { Chain } from "../src/types";
export default {
  "chain": "DreyerX",
  "chainId": 23452,
  "explorers": [
    {
      "name": "drxscan",
      "url": "https://testnet-scan.dreyerx.com",
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
  "name": "DreyerX Testnet",
  "nativeCurrency": {
    "name": "DreyerX",
    "symbol": "DRX",
    "decimals": 18
  },
  "networkId": 23452,
  "rpc": [
    "https://23452.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.dreyerx.com"
  ],
  "shortName": "dreyerx-testnet",
  "slug": "dreyerx-testnet",
  "testnet": true
} as const satisfies Chain;