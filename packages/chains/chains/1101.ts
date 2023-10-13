import type { Chain } from "../src/types";
export default {
  "chain": "Polygon",
  "chainId": 1101,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://zkevm.polygonscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmNmJZkQgx9RcFLS3rvxQTVYcPfyAFPr667keHTUxB9PDv",
    "width": 122,
    "height": 135,
    "format": "png"
  },
  "infoURL": "https://polygon.technology/polygon-zkevm",
  "name": "Polygon zkEVM",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://polygon-zkevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zkevm-rpc.com"
  ],
  "shortName": "zkevm",
  "slug": "polygon-zkevm",
  "testnet": false
} as const satisfies Chain;