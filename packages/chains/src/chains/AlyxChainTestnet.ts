import type { Chain } from "../types";
export default {
  "chain": "Alyx Chain Testnet",
  "chainId": 135,
  "explorers": [
    {
      "name": "alyx testnet scan",
      "url": "https://testnet.alyxscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.alyxchain.com"
  ],
  "icon": {
    "url": "ipfs://bafkreifd43fcvh77mdcwjrpzpnlhthounc6b4u645kukqpqhduaveatf6i",
    "width": 2481,
    "height": 2481,
    "format": "png"
  },
  "infoURL": "https://www.alyxchain.com",
  "name": "Alyx Chain Testnet",
  "nativeCurrency": {
    "name": "Alyx Testnet Native Token",
    "symbol": "ALYX",
    "decimals": 18
  },
  "networkId": 135,
  "rpc": [
    "https://alyx-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://135.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.alyxchain.com"
  ],
  "shortName": "AlyxTestnet",
  "slug": "alyx-chain-testnet",
  "testnet": true
} as const satisfies Chain;