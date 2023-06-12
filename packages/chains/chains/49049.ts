import type { Chain } from "../src/types";
export default {
  "name": "Wireshape Floripa Testnet",
  "title": "Wireshape Floripa Testnet",
  "chain": "Wireshape",
  "icon": {
    "url": "ipfs://QmTAyT3YrW2654CBRqRkec2cCznv6EBsbsRc2y6WQPbvXx",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "rpc": [
    "https://wireshape-floripa-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-floripa.wireshape.org",
    "https://wireshape-floripa-testnet.rpc.thirdweb.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "WIRE",
    "symbol": "WIRE",
    "decimals": 18
  },
  "infoURL": "https://wireshape.org",
  "shortName": "floripa",
  "chainId": 49049,
  "networkId": 49049,
  "explorers": [
    {
      "name": "Wire Explorer",
      "url": "https://floripa-explorer.wireshape.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "wireshape-floripa-testnet"
} as const satisfies Chain;