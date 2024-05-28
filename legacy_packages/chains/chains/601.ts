import type { Chain } from "../src/types";
export default {
  "chain": "VINE",
  "chainId": 601,
  "explorers": [
    {
      "name": "Vine Explorer",
      "url": "https://vne.network/rose",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://vne.network/rose"
  ],
  "infoURL": "https://www.peer.inc",
  "name": "Vine Testnet",
  "nativeCurrency": {
    "name": "VINE",
    "symbol": "VNE",
    "decimals": 18
  },
  "networkId": 601,
  "rpc": [
    "https://601.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.vne.network"
  ],
  "shortName": "VINE",
  "slug": "vine-testnet",
  "testnet": true
} as const satisfies Chain;