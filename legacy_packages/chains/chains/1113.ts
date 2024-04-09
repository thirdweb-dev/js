import type { Chain } from "../src/types";
export default {
  "chain": "BSQ",
  "chainId": 1113,
  "explorers": [
    {
      "name": "B2 Hub Habitat Testnet Explorer",
      "url": "https://habitat-hub-explorer.bsquared.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmPV6ASrQDEkEW3g3ni7p2rJMPeciRLpEpvrAc1QfzVkx9",
        "width": 640,
        "height": 640,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPV6ASrQDEkEW3g3ni7p2rJMPeciRLpEpvrAc1QfzVkx9",
    "width": 640,
    "height": 640,
    "format": "png"
  },
  "infoURL": "https://www.bsquared.network",
  "name": "B2 Hub Habitat Testnet",
  "nativeCurrency": {
    "name": "BSquared Token",
    "symbol": "BSQ",
    "decimals": 18
  },
  "networkId": 1113,
  "rpc": [
    "https://1113.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://habitat-hub-rpc.bsquared.network"
  ],
  "shortName": "B2Hub-testnet",
  "slug": "b2-hub-habitat-testnet",
  "testnet": true
} as const satisfies Chain;