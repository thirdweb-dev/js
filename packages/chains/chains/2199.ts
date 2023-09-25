import type { Chain } from "../src/types";
export default {
  "chainId": 2199,
  "chain": "MSN",
  "name": "Moonsama Network",
  "rpc": [
    "https://moonsama-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.moonsama.com",
    "wss://rpc.moonsama.com/ws"
  ],
  "slug": "moonsama-network",
  "icon": {
    "url": "ipfs://QmaQxfwpXYTomUd24PMx5tKjosupXcm99z1jL1XLq9LWBS",
    "width": 468,
    "height": 468,
    "format": "png"
  },
  "faucets": [
    "https://multiverse.moonsama.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Sama Token",
    "symbol": "SAMA",
    "decimals": 18
  },
  "infoURL": "https://moonsama.com",
  "shortName": "msn",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.moonsama.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;