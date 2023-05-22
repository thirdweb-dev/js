import type { Chain } from "../src/types";
export default {
  "name": "Floripa",
  "title": "Wireshape Testnet Floripa",
  "chain": "Wireshape",
  "rpc": [
    "https://floripa.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-floripa.wireshape.org"
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
  "slug": "floripa"
} as const satisfies Chain;