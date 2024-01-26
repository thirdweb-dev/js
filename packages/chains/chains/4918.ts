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
  "infoURL": "https://venidium.io",
  "name": "Venidium Testnet",
  "nativeCurrency": {
    "name": "Venidium",
    "symbol": "XVM",
    "decimals": 18
  },
  "networkId": 4918,
  "rpc": [
    "https://venidium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4918.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-evm-testnet.venidium.io"
  ],
  "shortName": "txvm",
  "slip44": 1,
  "slug": "venidium-testnet",
  "testnet": true
} as const satisfies Chain;