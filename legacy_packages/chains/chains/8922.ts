import type { Chain } from "../src/types";
export default {
  "chain": "ALG L2",
  "chainId": 8922,
  "explorers": [
    {
      "name": "algl2scan",
      "url": "https://scan.alg2-test.algen.network",
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
  "name": "Algen Layer2 Testnet",
  "nativeCurrency": {
    "name": "ALG",
    "symbol": "ALG",
    "decimals": 18
  },
  "networkId": 8922,
  "parent": {
    "type": "shard",
    "chain": "eip155-8921"
  },
  "rpc": [
    "https://8922.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.alg2-test.algen.network"
  ],
  "shortName": "algl2Test",
  "slug": "algen-layer2-testnet",
  "testnet": true
} as const satisfies Chain;