import type { Chain } from "../src/types";
export default {
  "chain": "X1",
  "chainId": 204005,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.x1-testnet.xen.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "infoURL": "https://docs.xen.network/go-x1/",
  "name": "X1 Network",
  "nativeCurrency": {
    "name": "XN",
    "symbol": "XN",
    "decimals": 18
  },
  "networkId": 204005,
  "rpc": [
    "https://204005.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://x1-testnet.xen.network"
  ],
  "shortName": "x1-testnet",
  "slug": "x1-network",
  "testnet": true
} as const satisfies Chain;