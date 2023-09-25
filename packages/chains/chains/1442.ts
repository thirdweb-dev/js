import type { Chain } from "../src/types";
export default {
  "chainId": 1442,
  "chain": "Polygon",
  "name": "Polygon zkEVM Testnet",
  "rpc": [
    "https://polygon-zkevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.public.zkevm-test.net"
  ],
  "slug": "polygon-zkevm-testnet",
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
  "infoURL": "https://polygon.technology/solutions/polygon-zkevm/",
  "shortName": "testnet-zkEVM-mango",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Polygon zkEVM explorer",
      "url": "https://explorer.public.zkevm-test.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;