import type { Chain } from "../src/types";
export default {
  "chain": "ALG L2",
  "chainId": 8921,
  "explorers": [
    {
      "name": "algl2scan",
      "url": "https://scan.alg2.algen.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmbLWspX1WryyfhiiuPpG5A7AGBJUvwdZtVPuzZoJyxS23",
        "width": 323,
        "height": 323,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmbLWspX1WryyfhiiuPpG5A7AGBJUvwdZtVPuzZoJyxS23",
    "width": 323,
    "height": 323,
    "format": "png"
  },
  "infoURL": "https://www.algen.network",
  "name": "Algen Layer2",
  "nativeCurrency": {
    "name": "ALG",
    "symbol": "ALG",
    "decimals": 18
  },
  "networkId": 8921,
  "parent": {
    "type": "shard",
    "chain": "eip155-8911"
  },
  "rpc": [
    "https://8921.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.alg2.algen.network"
  ],
  "shortName": "algl2",
  "slug": "algen-layer2",
  "testnet": false
} as const satisfies Chain;