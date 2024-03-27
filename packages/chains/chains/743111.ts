import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 743111,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.explorer.hemi.network",
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
  "infoURL": "https://hemi.xyz",
  "name": "Hemi Sepolia",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 743111,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  },
  "rpc": [
    "https://743111.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.hemi.network/rpc"
  ],
  "shortName": "hemi-sep",
  "slug": "hemi-sepolia",
  "status": "active",
  "testnet": true
} as const satisfies Chain;