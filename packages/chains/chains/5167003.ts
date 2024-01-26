import type { Chain } from "../src/types";
export default {
  "chain": "MXC zkEVM",
  "chainId": 5167003,
  "explorers": [
    {
      "name": "MXC Wannsee zkEVM Testnet",
      "url": "https://wannsee-explorer.mxc.com",
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
  "infoURL": "https://wannsee.mxc.com/docs/intro",
  "name": "MXC Wannsee zkEVM Testnet",
  "nativeCurrency": {
    "name": "MXC Wannsee zkEVM Testnet",
    "symbol": "MXC",
    "decimals": 18
  },
  "networkId": 5167003,
  "rpc": [
    "https://mxc-wannsee-zkevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5167003.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://wannsee-rpc.mxc.com"
  ],
  "shortName": "MXC",
  "slip44": 1,
  "slug": "mxc-wannsee-zkevm-testnet",
  "testnet": true
} as const satisfies Chain;