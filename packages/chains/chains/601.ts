import type { Chain } from "../src/types";
export default {
  "chain": "VINE",
  "chainId": 601,
  "explorers": [
    {
      "name": "Vine Explorer",
      "url": "https://vne.network/rose",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmTPbbhH4CkQiQWm4JUh3J9o5w79vXjFZaMBW4DKNuSVU3",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://vne.network/rose"
  ],
  "icon": {
    "url": "ipfs://QmTPbbhH4CkQiQWm4JUh3J9o5w79vXjFZaMBW4DKNuSVU3",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.peer.inc",
  "name": "Vine Testnet",
  "nativeCurrency": {
    "name": "VINE",
    "symbol": "VNE",
    "decimals": 18
  },
  "networkId": 601,
  "rpc": [
    "https://vine-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://601.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.vne.network"
  ],
  "shortName": "VINE",
  "slug": "vine-testnet",
  "testnet": true
} as const satisfies Chain;