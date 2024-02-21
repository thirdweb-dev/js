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
  "networkId": 49049,
  "rpc": [
    "https://49049.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-floripa.wireshape.org"
  ],
  "shortName": "floripa",
  "slip44": 1,
  "slug": "wireshape-floripa-testnet",
  "testnet": true,
  "title": "Wireshape Floripa Testnet"
} as const satisfies Chain;