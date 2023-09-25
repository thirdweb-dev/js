import type { Chain } from "../src/types";
export default {
  "chainId": 1101,
  "chain": "Polygon",
  "name": "Polygon zkEVM",
  "rpc": [
    "https://polygon-zkevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zkevm-rpc.com"
  ],
  "slug": "polygon-zkevm",
  "icon": {
    "url": "ipfs://QmNmJZkQgx9RcFLS3rvxQTVYcPfyAFPr667keHTUxB9PDv",
    "width": 122,
    "height": 135,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://polygon.technology/polygon-zkevm",
  "shortName": "zkevm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://zkevm.polygonscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;