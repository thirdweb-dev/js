import type { Chain } from "../src/types";
export default {
  "chain": "OpTrust",
  "chainId": 537,
  "explorers": [
    {
      "name": "OpTrust explorer",
      "url": "https://scan.optrust.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmYktPMo4tdQhMA9nRJBVckjzHcFLbpHbTVNSpGUUPEP8J",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYktPMo4tdQhMA9nRJBVckjzHcFLbpHbTVNSpGUUPEP8J",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://optrust.io",
  "name": "OpTrust Mainnet",
  "nativeCurrency": {
    "name": "BSC",
    "symbol": "BNB",
    "decimals": 18
  },
  "networkId": 537,
  "rpc": [
    "https://537.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.optrust.io"
  ],
  "shortName": "optrust",
  "slug": "optrust",
  "testnet": false
} as const satisfies Chain;