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
    "url": "ipfs://bafkreidyrvphfojaf7iev57trxk3sxbo6qikg26pdy66ke4n22dgm52wwa",
    "width": 320,
    "height": 320,
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