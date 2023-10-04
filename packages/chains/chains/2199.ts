import type { Chain } from "../src/types";
export default {
  "chain": "MSN",
  "chainId": 2199,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.moonsama.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://multiverse.moonsama.com/faucet"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmaQxfwpXYTomUd24PMx5tKjosupXcm99z1jL1XLq9LWBS",
    "width": 468,
    "height": 468,
    "format": "png"
  },
  "infoURL": "https://moonsama.com",
  "name": "Moonsama Network",
  "nativeCurrency": {
    "name": "Sama Token",
    "symbol": "SAMA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://moonsama-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.moonsama.com",
    "wss://rpc.moonsama.com/ws"
  ],
  "shortName": "msn",
  "slug": "moonsama-network",
  "testnet": false
} as const satisfies Chain;