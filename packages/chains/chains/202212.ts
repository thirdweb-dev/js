import type { Chain } from "../src/types";
export default {
  "chain": "X1",
  "chainId": 202212,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.x1-devnet.xen.network",
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
  "infoURL": "https://docs.xen.network/x1/",
  "name": "X1 Devnet",
  "nativeCurrency": {
    "name": "XN",
    "symbol": "XN",
    "decimals": 18
  },
  "networkId": 202212,
  "rpc": [
    "https://x1-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://202212.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://x1-devnet.xen.network"
  ],
  "shortName": "x1-devnet",
  "slug": "x1-devnet",
  "testnet": false
} as const satisfies Chain;