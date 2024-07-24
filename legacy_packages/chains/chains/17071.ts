import type { Chain } from "../src/types";
export default {
  "chain": "POP",
  "chainId": 17071,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.onchainpoints.xyz",
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
  "icon": {
    "url": "ipfs://QmbY9ZPnveSEnFhbhfHr5B2R8SPhQBKbAZnwQCoEkvAQtT",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://onchainpoints.xyz",
  "name": "Onchain Points",
  "nativeCurrency": {
    "name": "OnchainPoints.xyz",
    "symbol": "POP",
    "decimals": 18
  },
  "networkId": 17071,
  "rpc": [
    "https://17071.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.onchainpoints.xyz",
    "https://rpc-onchain-points-8n0qkkpr2j.t.conduit.xyz/{CONDUIT_API_KEY}"
  ],
  "shortName": "pop",
  "slug": "onchain-points",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;