import type { Chain } from "../src/types";
export default {
  "chain": "MXC zkEVM",
  "chainId": 5167004,
  "explorers": [
    {
      "name": "Moonchain Geneva Testnet",
      "url": "https://geneva-explorer.moonchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmdGCthKA11K9kCZJdbTP5WPAyq1wiRZ3REn6KG58MrWaE",
    "width": 159,
    "height": 159,
    "format": "png"
  },
  "infoURL": "https://doc.mxc.com/docs/intro",
  "name": "Moonchain Geneva Testnet",
  "nativeCurrency": {
    "name": "Moonchain Geneva Testnet",
    "symbol": "MXC",
    "decimals": 18
  },
  "networkId": 5167004,
  "rpc": [
    "https://5167004.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://geneva-rpc.moonchain.com"
  ],
  "shortName": "MXC",
  "slip44": 1,
  "slug": "moonchain-geneva-testnet",
  "testnet": true
} as const satisfies Chain;