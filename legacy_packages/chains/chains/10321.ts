import type { Chain } from "../src/types";
export default {
  "chain": "TAO EVM",
  "chainId": 10321,
  "explorers": [
    {
      "name": "TAO Mainnet Explorer",
      "url": "https://taoscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmS78hUX5zqYDqoFgyVmtWpCcx7bZW86Nhw5Nqt2GJrLh2",
    "width": 256,
    "height": 234,
    "format": "png"
  },
  "infoURL": "https://taoevm.io",
  "name": "TAO EVM Mainnet",
  "nativeCurrency": {
    "name": "TAO",
    "symbol": "TAO",
    "decimals": 18
  },
  "networkId": 10321,
  "rpc": [
    "https://10321.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.taoevm.io"
  ],
  "shortName": "TAOm",
  "slug": "tao-evm",
  "testnet": false
} as const satisfies Chain;