import type { Chain } from "../src/types";
export default {
  "chain": "OML",
  "chainId": 21816,
  "explorers": [
    {
      "name": "omChain Explorer",
      "url": "https://explorer.omchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQtEHaejiDbmiCvbBYw9jNQv3DLK5XHCQwLRfnLNpdN5j",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://omchain.io",
  "name": "omChain Mainnet",
  "nativeCurrency": {
    "name": "omChain",
    "symbol": "OMC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://omchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed.omchain.io"
  ],
  "shortName": "omc",
  "slug": "omchain",
  "testnet": false
} as const satisfies Chain;