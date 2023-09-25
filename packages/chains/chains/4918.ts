import type { Chain } from "../src/types";
export default {
  "chainId": 4918,
  "chain": "XVM",
  "name": "Venidium Testnet",
  "rpc": [
    "https://venidium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-evm-testnet.venidium.io"
  ],
  "slug": "venidium-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Venidium",
    "symbol": "XVM",
    "decimals": 18
  },
  "infoURL": "https://venidium.io",
  "shortName": "txvm",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Venidium EVM Testnet Explorer",
      "url": "https://evm-testnet.venidiumexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;