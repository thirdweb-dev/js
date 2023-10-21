import type { Chain } from "../src/types";
export default {
  "chain": "EXN",
  "chainId": 2109,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.exosama.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmaQxfwpXYTomUd24PMx5tKjosupXcm99z1jL1XLq9LWBS",
    "width": 468,
    "height": 468,
    "format": "png"
  },
  "infoURL": "https://moonsama.com",
  "name": "Exosama Network",
  "nativeCurrency": {
    "name": "Sama Token",
    "symbol": "SAMA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://exosama-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.exosama.com",
    "wss://rpc.exosama.com"
  ],
  "shortName": "exn",
  "slug": "exosama-network",
  "testnet": false
} as const satisfies Chain;