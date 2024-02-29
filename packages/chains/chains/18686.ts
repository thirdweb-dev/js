import type { Chain } from "../src/types";
export default {
  "chain": "MXC zkEVM",
  "chainId": 18686,
  "explorers": [
    {
      "name": "MXC zkEVM Mainnet",
      "url": "https://explorer.mxc.com",
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
  "name": "MXC zkEVM Mainnet",
  "nativeCurrency": {
    "name": "MXC zkEVM Mainnet",
    "symbol": "MXC",
    "decimals": 18
  },
  "networkId": 18686,
  "rpc": [
    "https://18686.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mxc.com"
  ],
  "shortName": "MXCzkEVM",
  "slug": "mxc-zkevm",
  "testnet": false
} as const satisfies Chain;