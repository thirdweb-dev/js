import type { Chain } from "../src/types";
export default {
  "chainId": 5167003,
  "chain": "MXC zkEVM",
  "name": "MXC Wannsee zkEVM Testnet",
  "rpc": [
    "https://mxc-wannsee-zkevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://wannsee-rpc.mxc.com"
  ],
  "slug": "mxc-wannsee-zkevm-testnet",
  "icon": {
    "url": "ipfs://QmdGCthKA11K9kCZJdbTP5WPAyq1wiRZ3REn6KG58MrWaE",
    "width": 159,
    "height": 159,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "MXC Wannsee zkEVM Testnet",
    "symbol": "MXC",
    "decimals": 18
  },
  "infoURL": "https://wannsee.mxc.com/docs/intro",
  "shortName": "MXC",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "MXC Wannsee zkEVM Testnet",
      "url": "https://wannsee-explorer.mxc.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;