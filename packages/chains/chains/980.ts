import type { Chain } from "../src/types";
export default {
  "chain": "TOP",
  "chainId": 980,
  "explorers": [
    {
      "name": "topscan.dev",
      "url": "https://www.topscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYikaM849eZrL8pGNeVhEHVTKWpxdGMvCY5oFBfZ2ndhd",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://www.topnetwork.org/",
  "name": "TOP Mainnet EVM",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 0,
  "rpc": [
    "https://top-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://980.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ethapi.topnetwork.org"
  ],
  "shortName": "top_evm",
  "slug": "top-evm",
  "testnet": false
} as const satisfies Chain;