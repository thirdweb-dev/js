import type { Chain } from "../src/types";
export default {
  "chain": "CVM",
  "chainId": 323,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.cosvm.net",
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
  "infoURL": "https://cosvm.network",
  "name": "Cosvm Mainnet",
  "nativeCurrency": {
    "name": "Cosvm",
    "symbol": "CVM",
    "decimals": 18
  },
  "networkId": 323,
  "rpc": [
    "https://cosvm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://323.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.cosvm.net"
  ],
  "shortName": "cvm",
  "slug": "cosvm",
  "testnet": false
} as const satisfies Chain;