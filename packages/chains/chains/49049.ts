import type { Chain } from "../src/types";
export default {
  "chainId": 49049,
  "chain": "Wireshape",
  "name": "Wireshape Floripa Testnet",
  "rpc": [
    "https://wireshape-floripa-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-floripa.wireshape.org",
    "https://wireshape-floripa-testnet.rpc.thirdweb.com"
  ],
  "slug": "wireshape-floripa-testnet",
  "icon": {
    "url": "ipfs://QmTAyT3YrW2654CBRqRkec2cCznv6EBsbsRc2y6WQPbvXx",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "WIRE",
    "symbol": "WIRE",
    "decimals": 18
  },
  "infoURL": "https://wireshape.org",
  "shortName": "floripa",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Wire Explorer",
      "url": "https://floripa-explorer.wireshape.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;