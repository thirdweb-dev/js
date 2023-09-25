import type { Chain } from "../src/types";
export default {
  "chainId": 77612,
  "chain": "VSC",
  "name": "Vention Smart Chain Mainnet",
  "rpc": [
    "https://vention-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.vention.network"
  ],
  "slug": "vention-smart-chain",
  "icon": {
    "url": "ipfs://QmcNepHmbmHW1BZYM3MFqJW4awwhmDqhUPRXXmRnXwg1U4",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "faucets": [
    "https://faucet.vention.network"
  ],
  "nativeCurrency": {
    "name": "VNT",
    "symbol": "VNT",
    "decimals": 18
  },
  "infoURL": "https://ventionscan.io",
  "shortName": "vscm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ventionscan",
      "url": "https://ventionscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;