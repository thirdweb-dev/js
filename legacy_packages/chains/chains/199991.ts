import type { Chain } from "../src/types";
export default {
  "chain": "MAZZE Testnet",
  "chainId": 199991,
  "explorers": [
    {
      "name": "MAZZE Testnet Explorer",
      "url": "https://mazzescan.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.mazze.io/"
  ],
  "icon": {
    "url": "ipfs://QmaR9Ud3aD7RaHYdsi3TdC1qx4zVusM76nd91s3Ghaz5fa",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://mazze.io/",
  "name": "MAZZE Testnet",
  "nativeCurrency": {
    "name": "MAZZE Testnet",
    "symbol": "MAZZE",
    "decimals": 18
  },
  "networkId": 199991,
  "rpc": [
    "https://199991.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.mazze.io/"
  ],
  "shortName": "MAZZE",
  "slug": "mazze-testnet",
  "testnet": true
} as const satisfies Chain;