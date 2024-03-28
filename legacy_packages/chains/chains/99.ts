import type { Chain } from "../src/types";
export default {
  "chain": "POA",
  "chainId": 99,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/poa/core",
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
  "infoURL": "https://poa.network",
  "name": "POA Network Core",
  "nativeCurrency": {
    "name": "POA Network Core Ether",
    "symbol": "POA",
    "decimals": 18
  },
  "networkId": 99,
  "rpc": [
    "https://99.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://core.poa.network"
  ],
  "shortName": "poa",
  "slip44": 178,
  "slug": "poa-network-core",
  "testnet": false
} as const satisfies Chain;