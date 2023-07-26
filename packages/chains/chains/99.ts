import type { Chain } from "../src/types";
export default {
  "name": "POA Network Core",
  "chain": "POA",
  "rpc": [
    "https://poa-network-core.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://core.poa.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "POA Network Core Ether",
    "symbol": "POA",
    "decimals": 18
  },
  "infoURL": "https://poa.network",
  "shortName": "poa",
  "chainId": 99,
  "networkId": 99,
  "slip44": 178,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/poa/core",
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
  "slug": "poa-network-core"
} as const satisfies Chain;