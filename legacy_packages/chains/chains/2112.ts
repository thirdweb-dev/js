import type { Chain } from "../src/types";
export default {
  "chain": "UCHAIN",
  "chainId": 2112,
  "explorers": [
    {
      "name": "uchain.info",
      "url": "https://uchain.info",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmUz6jimQbYZ43aeQBC6nSy2m7W7U6xR2qG8tCki2Jvj9k",
    "width": 344,
    "height": 342,
    "format": "png"
  },
  "infoURL": "https://u.cash/",
  "name": "UCHAIN Mainnet",
  "nativeCurrency": {
    "name": "UCASH",
    "symbol": "UCASH",
    "decimals": 18
  },
  "networkId": 2112,
  "rpc": [
    "https://2112.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.uchain.link/"
  ],
  "shortName": "uchain",
  "slug": "uchain",
  "testnet": false
} as const satisfies Chain;