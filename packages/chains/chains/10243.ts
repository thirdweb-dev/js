import type { Chain } from "../src/types";
export default {
  "name": "Arthera Testnet",
  "chain": "AA",
  "icon": {
    "url": "ipfs://QmYQp3e52KjkT4bYdAvB6ACEEpXs2D8DozsDitaADRY2Ak",
    "width": 1024,
    "height": 998,
    "format": "png"
  },
  "rpc": [
    "https://arthera-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test.arthera.net"
  ],
  "faucets": [
    "https://faucet.arthera.net"
  ],
  "nativeCurrency": {
    "name": "Arthera",
    "symbol": "AA",
    "decimals": 18
  },
  "infoURL": "https://docs.arthera.net",
  "shortName": "aa",
  "chainId": 10243,
  "networkId": 10243,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer-test.arthera.net",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "arthera-testnet"
} as const satisfies Chain;