import type { Chain } from "../types";
export default {
  "chain": "Polygon",
  "chainId": 1101,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://zkevm.polygonscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmNmJZkQgx9RcFLS3rvxQTVYcPfyAFPr667keHTUxB9PDv",
        "width": 122,
        "height": 135,
        "format": "png"
      }
    }
  ],
  "faucets": [],
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
  "networkId": 1101,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.zkevm-rpc.com"
      }
    ]
  },
  "rpc": [
    "https://polygon-zkevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1101.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zkevm-rpc.com"
  ],
  "shortName": "zkevm",
  "slug": "polygon-zkevm",
  "testnet": false,
  "title": "Polygon zkEVM"
} as const satisfies Chain;