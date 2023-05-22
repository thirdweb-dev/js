import type { Chain } from "../src/types";
export default {
  "name": "Polygon zkEVM",
  "title": "Polygon zkEVM",
  "chain": "Polygon",
  "rpc": [
    "https://polygon-zkevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zkevm-rpc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://polygon.technology/polygon-zkevm",
  "shortName": "zkevm",
  "chainId": 1101,
  "networkId": 1101,
  "icon": {
    "url": "ipfs://QmNmJZkQgx9RcFLS3rvxQTVYcPfyAFPr667keHTUxB9PDv",
    "width": 122,
    "height": 135,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://zkevm.polygonscan.com",
      "icon": {
        "url": "ipfs://QmNmJZkQgx9RcFLS3rvxQTVYcPfyAFPr667keHTUxB9PDv",
        "width": 122,
        "height": 135,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.zkevm-rpc.com"
      }
    ]
  },
  "testnet": false,
  "slug": "polygon-zkevm"
} as const satisfies Chain;