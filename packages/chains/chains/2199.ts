import type { Chain } from "../src/types";
export default {
  "name": "Moonsama Network",
  "chain": "MSN",
  "rpc": [
    "https://moonsama-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.moonsama.com",
    "wss://rpc.moonsama.com/ws"
  ],
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
  "chainId": 2199,
  "networkId": 2199,
  "slip44": 2199,
  "icon": {
    "url": "ipfs://QmaQxfwpXYTomUd24PMx5tKjosupXcm99z1jL1XLq9LWBS",
    "width": 468,
    "height": 468,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.moonsama.com",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "moonsama-network"
} as const satisfies Chain;