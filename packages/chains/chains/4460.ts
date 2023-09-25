import type { Chain } from "../src/types";
export default {
  "chainId": 4460,
  "chain": "ETH",
  "name": "Orderly Sepolia Testnet",
  "rpc": [
    "https://orderly-sepolia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2-orderly-l2-4460-sepolia-8tc3sd7dvy.t.conduit.xyz"
  ],
  "slug": "orderly-sepolia-testnet",
  "icon": {
    "url": "ipfs://QmSpwp3RAVhZsErAQrCQxEmjnGqJQMigarzZbfqr9Ktakb",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": null,
  "shortName": "orderlyl2",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "basescout",
      "url": "https://explorerl2new-orderly-l2-4460-sepolia-8tc3sd7dvy.t.conduit.xyz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;