import type { Chain } from "../src/types";
export default {
  "name": "Neonlink Testnet",
  "chain": "Neonlink",
  "rpc": [
    "https://neonlink-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.neonlink.io"
  ],
  "faucets": [
    "https://faucet.neonlink.io/"
  ],
  "nativeCurrency": {
    "name": "Neonlink Native Token",
    "symbol": "tNEON",
    "decimals": 18
  },
  "infoURL": "https://neonlink.io",
  "shortName": "testneon",
  "chainId": 9559,
  "networkId": 9559,
  "icon": {
    "url": "ipfs://QmX3hBv8WyvVfYjh1gmgDfJCpJBvKk4TYG9wFX9sC8WAjz",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
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
  "testnet": true,
  "slug": "neonlink-testnet"
} as const satisfies Chain;