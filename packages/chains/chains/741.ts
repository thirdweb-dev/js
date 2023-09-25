import type { Chain } from "../src/types";
export default {
  "chainId": 741,
  "chain": "VSCT",
  "name": "Vention Smart Chain Testnet",
  "rpc": [
    "https://vention-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node-testnet.vention.network"
  ],
  "slug": "vention-smart-chain-testnet",
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
  "infoURL": "https://testnet.ventionscan.io",
  "shortName": "vsct",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "ventionscan",
      "url": "https://testnet.ventionscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;