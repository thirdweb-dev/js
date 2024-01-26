import type { Chain } from "../src/types";
export default {
  "chain": "MSN",
  "chainId": 2199,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.moonsama.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://multiverse.moonsama.com/faucet"
  ],
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
  "networkId": 2199,
  "rpc": [
    "https://moonsama-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2199.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.moonsama.com",
    "wss://rpc.moonsama.com/ws"
  ],
  "shortName": "msn",
  "slip44": 2199,
  "slug": "moonsama-network",
  "testnet": false
} as const satisfies Chain;