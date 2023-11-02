import type { Chain } from "../src/types";
export default {
  "chain": "AA",
  "chainId": 10243,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer-test.arthera.net",
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
    "https://faucet.arthera.net"
  ],
  "icon": {
    "url": "ipfs://QmYQp3e52KjkT4bYdAvB6ACEEpXs2D8DozsDitaADRY2Ak",
    "width": 1024,
    "height": 998,
    "format": "png"
  },
  "infoURL": "https://docs.arthera.net",
  "name": "Arthera Testnet",
  "nativeCurrency": {
    "name": "Arthera",
    "symbol": "AA",
    "decimals": 18
  },
  "networkId": 10243,
  "rpc": [
    "https://arthera-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://10243.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test.arthera.net"
  ],
  "shortName": "aa",
  "slug": "arthera-testnet",
  "testnet": true
} as const satisfies Chain;