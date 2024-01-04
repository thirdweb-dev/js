import type { Chain } from "../src/types";
export default {
  "chain": "X1",
  "chainId": 4003,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.x1-fastnet.xen.network",
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
  "name": "X1 Fastnet",
  "nativeCurrency": {
    "name": "XN",
    "symbol": "XN",
    "decimals": 18
  },
  "networkId": 4003,
  "rpc": [
    "https://x1-fastnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4003.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://x1-fastnet.xen.network"
  ],
  "shortName": "x1-fastnet",
  "slug": "x1-fastnet",
  "testnet": false
} as const satisfies Chain;