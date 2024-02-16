import type { Chain } from "../src/types";
export default {
  "chain": "Polygon",
  "chainId": 2442,
  "explorers": [
    {
      "name": "polygonscan",
      "url": "https://cardona-zkevm.polygonscan.com",
      "standard": "EIP3091"
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
  "name": "Polygon zkEVM Cardona Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2442,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge-ui.cardona.zkevm-rpc.com"
      }
    ]
  },
  "rpc": [
    "https://polygon-zkevm-cardona-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2442.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.cardona.zkevm-rpc.com"
  ],
  "shortName": "zkevm-testnet-cardona",
  "slug": "polygon-zkevm-cardona-testnet",
  "testnet": true,
  "title": "Polygon zkEVM Cardona Testnet"
} as const satisfies Chain;