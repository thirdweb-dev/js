import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 291,
  "explorers": [
    {
      "name": "orderlyscout",
      "url": "https://explorer.orderly.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmSpwp3RAVhZsErAQrCQxEmjnGqJQMigarzZbfqr9Ktakb",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "name": "Orderly Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 291,
  "rpc": [
    "https://291.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.orderly.network",
    "https://l2-orderly-mainnet-0.t.conduit.xyz"
  ],
  "shortName": "orderly",
  "slug": "orderly",
  "testnet": false
} as const satisfies Chain;