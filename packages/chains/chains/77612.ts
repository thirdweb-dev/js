import type { Chain } from "../src/types";
export default {
  "chain": "VSC",
  "chainId": 77612,
  "explorers": [
    {
      "name": "ventionscan",
      "url": "https://ventionscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.vention.network"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmcNepHmbmHW1BZYM3MFqJW4awwhmDqhUPRXXmRnXwg1U4",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "infoURL": "https://ventionscan.io",
  "name": "Vention Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "VNT",
    "symbol": "VNT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://vention-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.vention.network"
  ],
  "shortName": "vscm",
  "slug": "vention-smart-chain",
  "testnet": false
} as const satisfies Chain;