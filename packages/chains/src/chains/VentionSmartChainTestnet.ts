import type { Chain } from "../types";
export default {
  "chain": "VSCT",
  "chainId": 741,
  "explorers": [
    {
      "name": "ventionscan",
      "url": "https://testnet.ventionscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.vention.network"
  ],
  "icon": {
    "url": "ipfs://QmcNepHmbmHW1BZYM3MFqJW4awwhmDqhUPRXXmRnXwg1U4",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "infoURL": "https://testnet.ventionscan.io",
  "name": "Vention Smart Chain Testnet",
  "nativeCurrency": {
    "name": "VNT",
    "symbol": "VNT",
    "decimals": 18
  },
  "networkId": 741,
  "rpc": [
    "https://vention-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://741.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node-testnet.vention.network"
  ],
  "shortName": "vsct",
  "slug": "vention-smart-chain-testnet",
  "testnet": true
} as const satisfies Chain;