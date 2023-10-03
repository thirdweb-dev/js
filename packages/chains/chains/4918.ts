import type { Chain } from "../src/types";
export default {
  "chain": "XVM",
  "chainId": 4918,
  "explorers": [
    {
      "name": "Venidium EVM Testnet Explorer",
      "url": "https://evm-testnet.venidiumexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://venidium.io",
  "name": "Venidium Testnet",
  "nativeCurrency": {
    "name": "Venidium",
    "symbol": "XVM",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://venidium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-evm-testnet.venidium.io"
  ],
  "shortName": "txvm",
  "slug": "venidium-testnet",
  "testnet": true
} as const satisfies Chain;