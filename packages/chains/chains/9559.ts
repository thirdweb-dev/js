import type { Chain } from "../src/types";
export default {
  "chain": "Neonlink",
  "chainId": 9559,
  "explorers": [
    {
      "name": "Neon Blockchain Explorer",
      "url": "https://testnet-scan.neonlink.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmX3hBv8WyvVfYjh1gmgDfJCpJBvKk4TYG9wFX9sC8WAjz",
        "width": 512,
        "height": 512,
        "format": "svg"
      }
    }
  ],
  "faucets": [
    "https://faucet.neonlink.io/"
  ],
  "icon": {
    "url": "ipfs://QmX3hBv8WyvVfYjh1gmgDfJCpJBvKk4TYG9wFX9sC8WAjz",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://neonlink.io",
  "name": "Neonlink Testnet",
  "nativeCurrency": {
    "name": "Neonlink Native Token",
    "symbol": "tNEON",
    "decimals": 18
  },
  "networkId": 9559,
  "rpc": [
    "https://neonlink-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9559.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.neonlink.io"
  ],
  "shortName": "testneon",
  "slug": "neonlink-testnet",
  "testnet": true
} as const satisfies Chain;