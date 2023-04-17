import type { Chain } from "../src/types";
export default {
  "name": "MXC Wannsee zkEVM Testnet",
  "chain": "MXC zkEVM",
  "icon": {
    "url": "ipfs://QmdGCthKA11K9kCZJdbTP5WPAyq1wiRZ3REn6KG58MrWaE",
    "width": 159,
    "height": 159,
    "format": "png"
  },
  "rpc": [
    "https://mxc-wannsee-zkevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://wannsee-rpc.mxc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MXC Wannsee zkEVM Testnet",
    "symbol": "MXC",
    "decimals": 18
  },
  "infoURL": "https://wannsee.mxc.com/docs/intro",
  "shortName": "MXC",
  "chainId": 5167003,
  "networkId": 5167003,
  "explorers": [
    {
      "name": "MXC Wannsee zkEVM Testnet",
      "url": "https://wannsee-explorer.mxc.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "mxc-wannsee-zkevm-testnet"
} as const satisfies Chain;