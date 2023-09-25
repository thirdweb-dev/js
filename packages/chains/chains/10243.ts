import type { Chain } from "../src/types";
export default {
  "chainId": 10243,
  "chain": "AA",
  "name": "Arthera Testnet",
  "rpc": [
    "https://arthera-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test.arthera.net"
  ],
  "slug": "arthera-testnet",
  "icon": {
    "url": "ipfs://QmYQp3e52KjkT4bYdAvB6ACEEpXs2D8DozsDitaADRY2Ak",
    "width": 1024,
    "height": 998,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer-test.arthera.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;