import type { Chain } from "../src/types";
export default {
  "chainId": 18686,
  "chain": "MXC zkEVM",
  "name": "MXC zkEVM Mainnet",
  "rpc": [
    "https://mxc-zkevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mxc.com"
  ],
  "slug": "mxc-zkevm",
  "icon": {
    "url": "ipfs://QmdGCthKA11K9kCZJdbTP5WPAyq1wiRZ3REn6KG58MrWaE",
    "width": 159,
    "height": 159,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "MXC zkEVM Mainnet",
    "symbol": "MXC",
    "decimals": 18
  },
  "infoURL": "https://doc.mxc.com/docs/intro",
  "shortName": "MXCzkEVM",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "MXC zkEVM Mainnet",
      "url": "https://explorer.mxc.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;