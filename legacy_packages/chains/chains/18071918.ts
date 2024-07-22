import type { Chain } from "../src/types";
export default {
  "chain": "Mande",
  "chainId": 18071918,
  "explorers": [
    {
      "name": "FYI",
      "url": "https://dym.fyi/r/mande",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmbCPtffFMcvifBKaddrjHtVLZrQorQiFgnNLAp9s2sS9x",
        "width": 35,
        "height": 35,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmbySJWaSQxzL3F4zvpKYaNvMjHsX2qUyWTv2kpitq9dW8",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://mande.network/",
  "name": "Mande Network Mainnet",
  "nativeCurrency": {
    "name": "Mand",
    "symbol": "MAND",
    "decimals": 18
  },
  "networkId": 18071918,
  "rpc": [
    "https://18071918.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mande-mainnet.public.blastapi.io"
  ],
  "shortName": "Mande",
  "slug": "mande-network",
  "testnet": false
} as const satisfies Chain;