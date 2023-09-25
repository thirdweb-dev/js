import type { Chain } from "../src/types";
export default {
  "chainId": 2109,
  "chain": "EXN",
  "name": "Exosama Network",
  "rpc": [
    "https://exosama-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.exosama.com",
    "wss://rpc.exosama.com"
  ],
  "slug": "exosama-network",
  "icon": {
    "url": "ipfs://QmaQxfwpXYTomUd24PMx5tKjosupXcm99z1jL1XLq9LWBS",
    "width": 468,
    "height": 468,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Sama Token",
    "symbol": "SAMA",
    "decimals": 18
  },
  "infoURL": "https://moonsama.com",
  "shortName": "exn",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.exosama.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;