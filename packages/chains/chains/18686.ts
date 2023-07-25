import type { Chain } from "../src/types";
export default {
  "name": "MXC zkEVM Mainnet",
  "chain": "MXC zkEVM",
  "icon": {
    "url": "ipfs://QmdGCthKA11K9kCZJdbTP5WPAyq1wiRZ3REn6KG58MrWaE",
    "width": 159,
    "height": 159,
    "format": "png"
  },
  "rpc": [
    "https://mxc-zkevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mxc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MXC zkEVM Mainnet",
    "symbol": "MXC",
    "decimals": 18
  },
  "infoURL": "https://doc.mxc.com/docs/intro",
  "shortName": "MXCzkEVM",
  "chainId": 18686,
  "networkId": 18686,
  "explorers": [
    {
      "name": "MXC zkEVM Mainnet",
      "url": "https://explorer.mxc.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "mxc-zkevm"
} as const satisfies Chain;