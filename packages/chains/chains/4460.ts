import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 4460,
  "explorers": [
    {
      "name": "basescout",
      "url": "https://explorerl2new-orderly-l2-4460-sepolia-8tc3sd7dvy.t.conduit.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmSpwp3RAVhZsErAQrCQxEmjnGqJQMigarzZbfqr9Ktakb",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "name": "Orderly Sepolia Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://orderly-sepolia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2-orderly-l2-4460-sepolia-8tc3sd7dvy.t.conduit.xyz"
  ],
  "shortName": "orderlyl2",
  "slug": "orderly-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;