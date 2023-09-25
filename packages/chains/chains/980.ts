import type { Chain } from "../src/types";
export default {
  "chainId": 980,
  "chain": "TOP",
  "name": "TOP Mainnet EVM",
  "rpc": [
    "https://top-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ethapi.topnetwork.org"
  ],
  "slug": "top-evm",
  "icon": {
    "url": "ipfs://QmYikaM849eZrL8pGNeVhEHVTKWpxdGMvCY5oFBfZ2ndhd",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.topnetwork.org/",
  "shortName": "top_evm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "topscan.dev",
      "url": "https://www.topscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;