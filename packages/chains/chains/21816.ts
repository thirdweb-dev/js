import type { Chain } from "../src/types";
export default {
  "chainId": 21816,
  "chain": "OML",
  "name": "omChain Mainnet",
  "rpc": [
    "https://omchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed.omchain.io"
  ],
  "slug": "omchain",
  "icon": {
    "url": "ipfs://QmQtEHaejiDbmiCvbBYw9jNQv3DLK5XHCQwLRfnLNpdN5j",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "omChain",
    "symbol": "OMC",
    "decimals": 18
  },
  "infoURL": "https://omchain.io",
  "shortName": "omc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "omChain Explorer",
      "url": "https://explorer.omchain.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;