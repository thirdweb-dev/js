import type { Chain } from "../src/types";
export default {
  "chain": "BEVM",
  "chainId": 11503,
  "explorers": [
    {
      "name": "bevm testnet scan",
      "url": "https://scan-testnet.bevm.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfMXiYn4xF9JwdjaqM5YKhqoByox51XvnL68VvKJS6yyu",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://bevm.io",
  "name": "BEVM Testnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 11503,
  "rpc": [
    "https://11503.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bevm.io/"
  ],
  "shortName": "bevm",
  "slug": "bevm-testnet",
  "testnet": true
} as const satisfies Chain;