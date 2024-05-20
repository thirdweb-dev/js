import type { Chain } from "../src/types";
export default {
  "chain": "Bloom",
  "chainId": 323213,
  "explorers": [
    {
      "name": "Bloom Genesis Testnet",
      "url": "https://testnet.bloomgenesis.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.bloomgenesis.com"
  ],
  "infoURL": "https://www.bloomgenesis.com",
  "name": "Bloom Genesis Testnet",
  "nativeCurrency": {
    "name": "Bloom",
    "symbol": "BGBC",
    "decimals": 18
  },
  "networkId": 323213,
  "rpc": [
    "https://323213.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.bloomgenesis.com"
  ],
  "shortName": "BGBC-Testnet",
  "slug": "bloom-genesis-testnet",
  "testnet": true
} as const satisfies Chain;