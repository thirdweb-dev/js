import type { Chain } from "../src/types";
export default {
  "chain": "Wireshape",
  "chainId": 49049,
  "explorers": [
    {
      "name": "Wire Explorer",
      "url": "https://floripa-explorer.wireshape.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmTAyT3YrW2654CBRqRkec2cCznv6EBsbsRc2y6WQPbvXx",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "infoURL": "https://wireshape.org",
  "name": "Wireshape Floripa Testnet",
  "nativeCurrency": {
    "name": "WIRE",
    "symbol": "WIRE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://wireshape-floripa-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-floripa.wireshape.org",
    "https://wireshape-floripa-testnet.rpc.thirdweb.com"
  ],
  "shortName": "floripa",
  "slug": "wireshape-floripa-testnet",
  "testnet": true
} as const satisfies Chain;