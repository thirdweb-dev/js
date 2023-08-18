import type { Chain } from "../src/types";
export default {
  "name": "Orderly Sepolia Testnet",
  "chain": "ETH",
  "rpc": [
    "https://orderly-sepolia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2-orderly-l2-4460-sepolia-8tc3sd7dvy.t.conduit.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "shortName": "orderlyl2",
  "chainId": 4460,
  "networkId": 4460,
  "icon": {
    "url": "ipfs://QmSpwp3RAVhZsErAQrCQxEmjnGqJQMigarzZbfqr9Ktakb",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "basescout",
      "url": "https://explorerl2new-orderly-l2-4460-sepolia-8tc3sd7dvy.t.conduit.xyz",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "orderly-sepolia-testnet"
} as const satisfies Chain;