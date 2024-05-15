import type { Chain } from "../src/types";
export default {
  "chain": "Tangle",
  "chainId": 5845,
  "explorers": [
    {
      "name": "Tangle EVM Explorer",
      "url": "https://explorer.tangle.tools",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmbxMNBTeQgch8t9GpWdLiS2R3wPYCzVRaX5kCQ4o5QU3w",
        "width": 1600,
        "height": 1600,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmbxMNBTeQgch8t9GpWdLiS2R3wPYCzVRaX5kCQ4o5QU3w",
    "width": 1600,
    "height": 1600,
    "format": "png"
  },
  "infoURL": "https://docs.tangle.tools",
  "name": "Tangle",
  "nativeCurrency": {
    "name": "Tangle",
    "symbol": "TNT",
    "decimals": 18
  },
  "networkId": 5845,
  "rpc": [
    "https://5845.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tangle.tools",
    "wss://rpc.tangle.tools"
  ],
  "shortName": "tangle",
  "slug": "tangle",
  "testnet": false
} as const satisfies Chain;