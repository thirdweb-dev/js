import type { Chain } from "../types";
export default {
  "chain": "Polygon",
  "chainId": 1442,
  "explorers": [
    {
      "name": "Polygon zkEVM explorer",
      "url": "https://explorer.public.zkevm-test.net",
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
  "infoURL": "https://polygon.technology/solutions/polygon-zkevm/",
  "name": "Polygon zkEVM Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1442,
  "redFlags": [],
  "rpc": [
    "https://polygon-zkevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1442.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.public.zkevm-test.net"
  ],
  "shortName": "testnet-zkEVM-mango",
  "slug": "polygon-zkevm-testnet",
  "testnet": false,
  "title": "Polygon zkEVM Testnet"
} as const satisfies Chain;